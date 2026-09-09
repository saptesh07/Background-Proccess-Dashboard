/* 10-day Hangfire retention window (ExpirationTimeAttribute = 10 days). */
window.JobHistory = (function () {
  const RETENTION_DAYS = 10;
  const NOW = new Date("2026-09-09T16:56:00+05:30");
  const FROM = new Date(NOW.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  function istParts(date) {
    const t = new Date(date.getTime() + IST_OFFSET);
    return {
      year: t.getUTCFullYear(),
      month: t.getUTCMonth() + 1,
      day: t.getUTCDate(),
      hour: t.getUTCHours(),
      minute: t.getUTCMinutes(),
      second: t.getUTCSeconds(),
      dow: t.getUTCDay()
    };
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatIST(date) {
    const p = istParts(date);
    return `${p.year}-${pad(p.month)}-${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`;
  }

  function dateKeyFromParts(p) {
    return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
  }

  function dateKey(date) {
    return dateKeyFromParts(istParts(date));
  }

  function cronStepMs(cron) {
    const minute = cron.split(" ")[0];
    if (minute === "*") return 60 * 1000;
    if (minute.startsWith("*/")) return Number(minute.slice(2)) * 60 * 1000;
    return 60 * 60 * 1000;
  }

  function fieldMatch(field, value) {
    if (field === "*") return true;
    if (field.startsWith("*/")) return value % Number(field.slice(2)) === 0;
    if (field.includes("-")) {
      const [a, b] = field.split("-").map(Number);
      return value >= a && value <= b;
    }
    if (field.includes(",")) return field.split(",").map(Number).includes(value);
    return Number(field) === value;
  }

  function cronMatch(cron, parts) {
    const [minute, hour, dom, month, dow] = cron.split(" ");
    return (
      fieldMatch(minute, parts.minute) &&
      fieldMatch(hour, parts.hour) &&
      fieldMatch(dom, parts.day) &&
      fieldMatch(month, parts.month) &&
      fieldMatch(dow, parts.dow)
    );
  }

  function seedFrom(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let s = seed || 1;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function parseDuration(text) {
    if (!text || text === "—") return 8;
    const hour = text.match(/(\d+)\s*h/);
    const min = text.match(/(\d+)\s*m/);
    const sec = text.match(/(\d+)\s*s/);
    return (hour ? Number(hour[1]) * 3600 : 0) + (min ? Number(min[1]) * 60 : 0) + (sec ? Number(sec[1]) : 0);
  }

  function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return s ? `${m}m ${s}s` : `${m}m`;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  function addSeconds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
  }

  function failRate(job) {
    if (job.id === "process-pending-notification") return 0.0004;
    if (job.id === "sync-user-access-details-tbl") return 0.004;
    if (job.id === "run-otp-clear-data") return 0.002;
    if (job.id === "user-triggered-background-process") return 0.02;
    if (job.id === "post-of-month-score") return 0;
    return 0.04;
  }

  function statusForAt(job, at, random) {
    if (job.lastRun && at.slice(0, 16) === job.lastRun.slice(0, 16)) return job.lastStatus;
    if (job.id === "post-of-month-score" && at.startsWith("2026-09-09")) return "Failed";
    if (random() < failRate(job)) return "Failed";
    return "Succeeded";
  }

  function durationFor(job, status, random) {
    if (status === "Running") return "—";
    const base = parseDuration(job.duration);
    const jitter = Math.max(1, Math.round(base * (0.85 + random() * 0.3)));
    if (status === "Failed") return formatDuration(Math.max(2, Math.round(jitter * 0.6)));
    return formatDuration(jitter);
  }

  function runsFor(job) {
    if (!job.enabled) return [];

    const runs = [];
    const random = rng(seedFrom(job.id));
    const stepMs = cronStepMs(job.cron);
    let cursor = new Date(Math.floor(FROM.getTime() / 60000) * 60000);
    while (cursor <= NOW && !cronMatch(job.cron, istParts(cursor))) {
      cursor = new Date(cursor.getTime() + 60 * 1000);
    }

    const ticks = [];
    while (cursor <= NOW) {
      const parts = istParts(cursor);
      if (cronMatch(job.cron, parts)) {
        ticks.push({
          date: new Date(cursor),
          parts,
          at: `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
        });
      }
      cursor = new Date(cursor.getTime() + stepMs);
    }

    ticks.forEach((tick) => {
      const at = tick.at;
      if (job.lastStatus === "Running" && job.lastRun && at.slice(0, 16) > job.lastRun.slice(0, 16)) return;
      const status = statusForAt(job, at, random);
      const duration = durationFor(job, status, random);
      const seconds = status === "Running" ? 0 : parseDuration(duration);
      runs.push({
        runId: `hf-${seedFrom(job.id + at).toString(16)}`,
        at,
        endedAt: status === "Running" ? null : formatIST(addSeconds(tick.date, seconds)),
        status,
        duration,
        date: dateKeyFromParts(tick.parts)
      });
    });

    const newestFirst = runs.reverse();
    (job.lastRuns || []).forEach((sample) => {
      const found = newestFirst.find((run) => run.at.slice(0, 16) === sample.at.slice(0, 16));
      if (!found) return;
      found.status = sample.status;
      found.duration = sample.duration;
      found.runId = sample.runId;
      found.endedAt = sample.status === "Running" ? null : found.endedAt;
    });
    return newestFirst;
  }

  function retentionDays() {
    const days = [];
    for (let i = RETENTION_DAYS - 1; i >= 0; i--) {
      const d = new Date(NOW.getTime() - i * 24 * 60 * 60 * 1000);
      days.push(dateKey(d));
    }
    return days;
  }

  function statsFor(runs) {
    const succeeded = runs.filter((r) => r.status === "Succeeded").length;
    const failed = runs.filter((r) => r.status === "Failed").length;
    const running = runs.filter((r) => r.status === "Running").length;
    const skipped = runs.filter((r) => r.status === "Skipped").length;
    const finished = runs.filter((r) => r.status === "Succeeded" || r.status === "Failed");
    const avgSeconds = finished.length
      ? Math.round(finished.reduce((sum, r) => sum + parseDuration(r.duration), 0) / finished.length)
      : 0;
    return {
      total: runs.length,
      succeeded,
      failed,
      running,
      skipped,
      successRate: runs.length ? Math.round((succeeded / Math.max(1, runs.length - running)) * 100) : 0,
      avgDuration: finished.length ? formatDuration(avgSeconds) : "—"
    };
  }

  function byDay(runs) {
    const days = retentionDays();
    return days.map((date) => {
      const items = runs.filter((r) => r.date === date);
      return {
        date,
        total: items.length,
        succeeded: items.filter((r) => r.status === "Succeeded").length,
        failed: items.filter((r) => r.status === "Failed").length,
        running: items.filter((r) => r.status === "Running").length
      };
    });
  }

  function shiftTime(baseTime, offsetSeconds) {
    const [h, m, s] = baseTime.split(":").map(Number);
    let total = h * 3600 + m * 60 + s + offsetSeconds;
    if (total < 0) total = 0;
    const hh = String(Math.floor(total / 3600) % 24).padStart(2, "0");
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  function parseGapSeconds(gap) {
    if (!gap) return 0;
    if (gap.endsWith("min")) {
      const n = gap.replace("+", "").replace("min", "");
      const [mm, ss] = n.split(".");
      return Number(mm) * 60 + Number((ss || "0").padEnd(2, "0").slice(0, 2));
    }
    return Number(gap.replace("+", "").replace("s", "")) || 0;
  }

  function flattenSteps(steps) {
    const out = [];
    (steps || []).forEach((step) => {
      const { children, ...rest } = step;
      out.push(rest);
      if (children && children.length) out.push(...flattenSteps(children));
    });
    return out;
  }

  function openName(step) {
    const range = String(step.key || "").match(/^(.*) Started range (.+)$/);
    if (range) return "batch " + range[2];
    const msg = (step.message || "").trim();
    if (msg === "Start" || /^Started\b/.test(msg)) return step.key;
    if (/\sStarted$/.test(step.key)) return step.key.replace(/\sStarted$/, "");
    return null;
  }

  function closeName(step) {
    const range = String(step.key || "").match(/^(.*) End range (.+)$/);
    if (range) return "batch " + range[2];
    const msg = (step.message || "").trim();
    if (msg === "End" || msg === "Completed" || /^(Completed|failed)\b/i.test(msg)) return step.key;
    if (/\sEnd$/.test(step.key)) return step.key.replace(/\sEnd$/, "");
    if (/\sCompleted$/.test(step.key)) return step.key.replace(/\sCompleted$/, "");
    return null;
  }

  function usefulDetail(message) {
    const msg = (message || "").trim();
    if (!msg || msg === "SP Call" || msg === "Start" || msg === "Started" || msg === "End" || msg === "Start-End") return "";
    if (/^Started\b/.test(msg) || /^Completed\b/.test(msg)) return "";
    return msg;
  }

  function wrapEnvelope(list) {
    if (!list || list.length < 2) return list;
    const first = list[0];
    const last = list[list.length - 1];
    if (first.message === "Start-End") return list;

    const startKey = openName(first);
    if (!startKey) return list;

    const lastIsCloser = closeName(last) === startKey;
    const children = lastIsCloser ? list.slice(1, -1) : list.slice(1);
    if (!children.length && !lastIsCloser) return list;

    const end = lastIsCloser ? last : last;
    return [{
      key: startKey,
      message: "Start-End",
      time: first.time,
      endTime: end.endTime || end.time,
      sinceLast: end.sinceLast,
      sinceStart: end.sinceStart,
      children
    }];
  }

  function nestStartEnd(steps) {
    const flat = flattenSteps(steps);
    let i = 0;

    function parseUntil(stop) {
      const list = [];
      while (i < flat.length) {
        const step = flat[i];
        const close = closeName(step);
        if (stop && close === stop) {
          i += 1;
          return { list, end: step };
        }
        const open = openName(step);
        const canPair = open && flat.slice(i + 1).some((later) => closeName(later) === open);
        if (canPair) {
          i += 1;
          const inner = parseUntil(open);
          list.push({
            key: open,
            message: inner.end ? "Start-End" : (step.message || "Start"),
            detail: usefulDetail(inner.end && inner.end.message) || usefulDetail(step.message),
            time: step.time,
            endTime: inner.end ? inner.end.time : null,
            sinceLast: inner.end ? inner.end.sinceLast : step.sinceLast,
            sinceStart: inner.end ? inner.end.sinceStart : step.sinceStart,
            children: inner.list
          });
          continue;
        }
        i += 1;
        list.push({ ...step, children: [] });
      }
      return { list, end: null };
    }

    return wrapEnvelope(parseUntil(null).list);
  }

  function mapStep(step, startClock, index) {
    const offset = parseGapSeconds(step.sinceStart);
    return {
      ...step,
      time: shiftTime(startClock, offset || index),
      children: (step.children || []).map((child, i) => mapStep(child, startClock, i))
    };
  }

  function stepsFor(job, run) {
    const template = job.steps && job.steps.length ? job.steps : [
      { time: "00:00:00", key: job.method, message: "Started", sinceLast: "+0s", sinceStart: "+0s" }
    ];

    if (run.status === "Running" && job.lastRun === run.at) return nestStartEnd(template);

    const startClock = run.at.slice(11);
    const mapped = template.map((step, index) => mapStep(step, startClock, index));

    if (run.status === "Succeeded") {
      return nestStartEnd(mapped.filter((step) => !/fail/i.test(step.key) && !/fail/i.test(step.message)));
    }

    if (run.status === "Failed") {
      const withoutFail = mapped.filter((step) => !/fail/i.test(step.key) && !/fail/i.test(step.message));
      const last = withoutFail[withoutFail.length - 1] || mapped[mapped.length - 1];
      const failAt = last ? last.sinceStart : "+0s";
      withoutFail.push({
        time: last ? last.time : startClock,
        key: job.method,
        message: `failed: 57014: canceling statement due to statement timeout | Hangfire job ${run.runId}`,
        sinceLast: last ? last.sinceLast : "+0s",
        sinceStart: failAt
      });
      return nestStartEnd(withoutFail);
    }

    return nestStartEnd(mapped);
  }

  return {
    RETENTION_DAYS,
    NOW,
    FROM,
    formatIST,
    dateKey,
    runsFor,
    statsFor,
    byDay,
    stepsFor,
    windowLabel: `${window.DateFmt.dateTime(formatIST(FROM), { seconds: false })} → ${window.DateFmt.dateTime(formatIST(NOW), { seconds: false })} IST`
  };
})();
