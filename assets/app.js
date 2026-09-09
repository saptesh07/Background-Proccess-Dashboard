(function () {
  const data = window.DASHBOARD_DATA;
  const SHOW_QUEUE = !!data.showUserTriggeredQueue;
  let view = "jobs";
  let category = "All";
  let statusFilter = "All";
  let query = "";
  let searchText = "";
  let selectedId = null;
  let queueDay = "2026-09-09";
  let queueSearch = "";
  let selectedQueue = null;
  let pollerRunsCache = null;

  const QUEUE_DAYS = ["2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06", "2026-09-07", "2026-09-08", "2026-09-09"];
  const QUEUE_FROM = QUEUE_DAYS[0];
  const QUEUE_TO = QUEUE_DAYS[QUEUE_DAYS.length - 1];

  const $ = (id) => document.getElementById(id);

  function statusClass(status) {
    return `status ${status}`;
  }

  function fmtWhen(value) {
    return window.DateFmt.dateTime(value);
  }

  function renderClock() {
    $("clock").textContent = "IST sample · " + window.DateFmt.dateTime("2026-09-09 16:56:00", { seconds: false });
  }

  function renderMeta() {
    $("side-meta").innerHTML = `
      Server ${data.server}<br />
      ${data.workerCount} workers · Hangfire<br />
      Timezone ${data.timezone}<br />
      Design data only
    `;
  }

  function requestDate(row) {
    return String(row.createdAt || row.startedAt || "").slice(0, 10);
  }

  function queueRows() {
    return (data.userQueue || []).filter((row) => {
      const date = requestDate(row);
      return date >= QUEUE_FROM && date <= QUEUE_TO;
    });
  }

  function statusCounts(items) {
    const counts = { total: items.length, Pending: 0, Processing: 0, Success: 0, Failed: 0 };
    items.forEach((row) => {
      if (counts[row.status] != null) counts[row.status] += 1;
    });
    return counts;
  }

  function pollerJob() {
    return data.jobs.find((job) => job.id === "user-triggered-background-process");
  }

  function pollerRuns() {
    if (!pollerRunsCache) pollerRunsCache = window.JobHistory.runsFor(pollerJob());
    return pollerRunsCache;
  }

  function floorPollerAt(startedAt) {
    const match = String(startedAt || "").match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2})/);
    if (!match) return null;
    const minute = String(Math.floor(Number(match[3]) / 30) * 30).padStart(2, "0");
    return `${match[1]} ${match[2]}:${minute}:00`;
  }

  function hangfireRunFor(row) {
    if (!row.startedAt) return null;
    const tick = floorPollerAt(row.startedAt);
    const found = pollerRuns().find((run) => run.at.slice(0, 16) === tick.slice(0, 16));
    return found || { runId: null, at: tick, status: "Unknown", duration: "—" };
  }

  function hangfireLogUrl(runId) {
    return "job.html?id=user-triggered-background-process&run=" + encodeURIComponent(runId);
  }

  function hangfireBundles(requests) {
    const map = new Map();
    requests.forEach((row) => {
      const run = hangfireRunFor(row);
      const key = run && run.runId ? run.runId : (run ? "unmapped:" + run.at : "pending");
      if (!map.has(key)) map.set(key, { key, run, requests: [] });
      map.get(key).requests.push(row);
    });
    return [...map.values()].sort((a, b) => {
      if (!a.run) return -1;
      if (!b.run) return 1;
      return String(b.run.at).localeCompare(String(a.run.at));
    });
  }

  function runGroupsForDay(date) {
    const items = queueRows().filter((row) => requestDate(row) === date);
    return hangfireBundles(items).map((bundle) => ({
      date,
      key: bundle.key,
      run: bundle.run,
      requests: bundle.requests,
      counts: statusCounts(bundle.requests),
      codes: [...new Set(bundle.requests.map((row) => row.jobCode))]
    }));
  }

  function renderKpis() {
    if (view === "queue") {
      const counts = statusCounts(queueRows());
      $("kpis").innerHTML = `
        <article class="kpi"><div class="label">Requests (10 days)</div><div class="value">${counts.total}</div></article>
        <article class="kpi warn"><div class="label">Pending</div><div class="value">${counts.Pending}</div></article>
        <article class="kpi running"><div class="label">Processing</div><div class="value">${counts.Processing}</div></article>
        <article class="kpi ok"><div class="label">Success</div><div class="value">${counts.Success}</div></article>
        <article class="kpi bad"><div class="label">Failed</div><div class="value">${counts.Failed}</div></article>
        <article class="kpi"><div class="label">Job codes</div><div class="value">${new Set(queueRows().map((row) => row.jobCode)).size}</div></article>
      `;
      return;
    }
    const k = data.kpis;
    const live = SHOW_QUEUE ? statusCounts(queueRows()) : null;
    $("kpis").innerHTML = `
      <article class="kpi running"><div class="label">Running now</div><div class="value">${k.running}</div></article>
      <article class="kpi ok"><div class="label">Succeeded (24h)</div><div class="value">${k.succeeded24h}</div></article>
      <article class="kpi bad"><div class="label">Failed (24h)</div><div class="value">${k.failed24h}</div></article>
      <article class="kpi"><div class="label">Skipped (24h)</div><div class="value">${k.skipped24h}</div></article>
      ${SHOW_QUEUE ? `
      <article class="kpi warn"><div class="label">User queue pending</div><div class="value">${live.Pending}</div></article>
      <article class="kpi running"><div class="label">User queue processing</div><div class="value">${live.Processing}</div></article>
      ` : ""}
    `;
  }

  function filteredJobs() {
    return data.jobs.filter((job) => {
      if (category !== "All" && job.category !== category) return false;
      if (statusFilter !== "All" && job.lastStatus !== statusFilter) return false;
      if (!query) return true;
      const hay = `${job.name} ${job.method} ${job.id} ${job.summary}`.toLowerCase();
      return hay.includes(query);
    });
  }

  function renderJobs() {
    const jobs = filteredJobs();
    const cats = data.categories.map((c) => `<option ${c === category ? "selected" : ""}>${c}</option>`).join("");
    const statuses = ["All", "Running", "Succeeded", "Failed", "Disabled"]
      .map((s) => `<option ${s === statusFilter ? "selected" : ""}>${s}</option>`)
      .join("");

    const rows = jobs.map((job) => `
      <tr data-id="${job.id}" class="${job.id === selectedId ? "selected" : ""}">
        <td>
          <div class="job-name">${job.name}</div>
          <div class="job-method">${job.method}</div>
        </td>
        <td>${job.category}</td>
        <td>${job.schedule}<div class="job-method">${job.cron}</div></td>
        <td><span class="${statusClass(job.lastStatus)}">${job.lastStatus}</span></td>
        <td>${fmtWhen(job.lastRun)}</td>
        <td>${fmtWhen(job.nextRun)}</td>
        <td class="right">${job.duration}</td>
      </tr>
    `).join("");

    $("view").innerHTML = `
      <div class="toolbar">
        <input id="search" type="search" placeholder="Search jobs, methods, stored procedures" value="${escapeAttr(searchText)}" />
        <select id="category">${cats}</select>
        <select id="status">${statuses}</select>
        <span class="hint">${jobs.length} of ${data.jobs.length} jobs · click a row for 10-day history</span>
      </div>
      <div style="overflow:auto">
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Category</th>
              <th>Schedule (IST)</th>
              <th>Last status</th>
              <th>Last run</th>
              <th>Next run</th>
              <th class="right">Duration</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="7" class="empty">No jobs match.</td></tr>`}</tbody>
        </table>
      </div>
    `;

    $("search").addEventListener("input", (e) => {
      searchText = e.target.value;
      query = searchText.trim().toLowerCase();
      render();
    });
    $("category").addEventListener("change", (e) => { category = e.target.value; render(); });
    $("status").addEventListener("change", (e) => { statusFilter = e.target.value; render(); });
    $("view").querySelectorAll("tbody tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        location.href = "job.html?id=" + encodeURIComponent(row.getAttribute("data-id"));
      });
    });
  }

  function statusPills(counts) {
    return ["Pending", "Processing", "Success", "Failed"]
      .filter((status) => counts[status])
      .map((status) => `<span class="queue-pill ${status}">${counts[status]} ${status}</span>`)
      .join("");
  }

  function runRow(group) {
    const selected = selectedQueue && selectedQueue.date === group.date && selectedQueue.key === group.key;
    const run = group.run;
    const title = run && run.runId
      ? `<a class="run-link" href="${hangfireLogUrl(run.runId)}">${escapeHtml(run.runId)}</a>`
      : `<div class="job-name">${run ? "Unmapped poller slot" : "Not picked yet"}</div>`;
    const when = run && run.at ? fmtWhen(run.at) : "Waiting for next Hangfire poll (17:00)";
    return `
      <tr data-date="${group.date}" data-key="${escapeAttr(group.key)}" class="${selected ? "selected" : ""}">
        <td>
          ${title}
          <div class="job-method">${when}</div>
          <div class="queue-pills">${statusPills(group.counts)}</div>
        </td>
        <td>${run ? `<span class="${statusClass(run.status)}">${run.status}</span>` : `<span class="status Pending">Pending</span>`}</td>
        <td class="job-method">${escapeHtml(group.codes.join(", "))}</td>
        <td class="right">${group.counts.total}</td>
        <td>${group.counts.Pending}</td>
        <td>${group.counts.Processing}</td>
        <td>${group.counts.Success}</td>
        <td>${group.counts.Failed}</td>
      </tr>
    `;
  }

  function runTable(groups) {
    const rows = groups.map(runRow).join("");
    return `
      <div style="overflow:auto">
        <table>
          <thead>
            <tr>
              <th>Hangfire run</th>
              <th>Run status</th>
              <th>Job codes</th>
              <th class="right">Requests</th>
              <th>Pending</th>
              <th>Processing</th>
              <th>Success</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="8" class="empty">No Hangfire runs mapped for this day.</td></tr>`}</tbody>
        </table>
      </div>
    `;
  }

  function matchesQueueSearch(group) {
    if (!queueSearch) return true;
    const hay = `${group.jobCode || ""} ${group.key || ""} ${group.run && group.run.runId || ""} ${(group.codes || []).join(" ")}`.toLowerCase();
    return hay.includes(queueSearch);
  }

  function renderQueueDays() {
    const all = queueRows();
    const max = Math.max(1, ...QUEUE_DAYS.map((date) => all.filter((row) => requestDate(row) === date).length));
    const chips = [`<button type="button" class="day-chip ${queueDay === "all" ? "active" : ""}" data-day="all">All 10 days<span>${all.length}</span></button>`]
      .concat(QUEUE_DAYS.map((date) => {
        const items = all.filter((row) => requestDate(row) === date);
        const failed = items.filter((row) => row.status === "Failed").length;
        return `
          <button type="button" class="day-chip ${queueDay === date ? "active" : ""} ${failed ? "has-fail" : ""}" data-day="${date}">
            ${window.DateFmt.dayMonth(date)}
            <span>${items.length}${failed ? ` · ${failed} failed` : ""}</span>
            <i style="height:${Math.max(6, Math.round((items.length / max) * 28))}px"></i>
          </button>
        `;
      }))
      .join("");

    $("days").hidden = false;
    $("days").innerHTML = `
      <div class="toolbar">
        <span class="hint">dbo.background_process_request mapped to UserTriggeredBackgroundProcess Hangfire runs (every 30 min)</span>
      </div>
      <div class="day-row">${chips}</div>
    `;
    $("days").querySelectorAll("[data-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        queueDay = btn.getAttribute("data-day");
        closeDrawer();
        renderQueue();
      });
    });
  }

  function bindGroupClicks() {
    $("view").querySelectorAll("a.run-link").forEach((link) => {
      link.addEventListener("click", (e) => e.stopPropagation());
    });
    $("view").querySelectorAll("tbody tr[data-key]").forEach((row) => {
      row.addEventListener("click", () => {
        openHangfireGroup(row.getAttribute("data-date"), row.getAttribute("data-key"));
      });
    });
  }

  function renderQueue() {
    renderQueueDays();
    const days = queueDay === "all" ? QUEUE_DAYS.slice().reverse() : [queueDay];
    const sections = days.map((date) => {
      const groups = runGroupsForDay(date).filter(matchesQueueSearch);
      const body = runTable(groups);
      if (queueDay === "all") {
        return `
          <div class="day-block">
            <div class="day-block-head">${window.DateFmt.date(date)}</div>
            ${body}
          </div>
        `;
      }
      return body;
    }).join("");

    const visible = days.reduce((sum, date) => sum + runGroupsForDay(date).filter(matchesQueueSearch).length, 0);

    $("view").innerHTML = `
      <div class="toolbar">
        <input id="queue-search" type="search" placeholder="Filter Hangfire run id or job code" value="${escapeAttr(queueSearch)}" />
        <span class="hint">${visible} Hangfire run${visible === 1 ? "" : "s"} · click a row for requests · click the run id for the step log</span>
      </div>
      ${sections}
    `;

    const search = $("queue-search");
    search.addEventListener("input", (e) => {
      queueSearch = e.target.value.trim().toLowerCase();
      const caret = e.target.selectionStart;
      renderQueue();
      const el = $("queue-search");
      el.focus();
      el.setSelectionRange(caret, caret);
    });
    bindGroupClicks();
  }

  function requestCard(row) {
    return `
      <article class="req-card ${row.status}">
        <div class="req-card-top">
          <span class="job-method">job_id ${row.jobId}</span>
          <span class="${statusClass(row.status)}">${row.status}</span>
        </div>
        <div class="req-grid">
          <div><div class="k">Created</div><div class="v">${fmtWhen(row.createdAt)}</div></div>
          <div><div class="k">Attempts</div><div class="v">${row.attemptCount}</div></div>
          <div><div class="k">Started</div><div class="v">${fmtWhen(row.startedAt)}</div></div>
          <div><div class="k">Ended</div><div class="v">${fmtWhen(row.endedAt)}</div></div>
        </div>
        <div class="req-grid" style="margin-top:8px; grid-template-columns:1fr">
          <div><div class="k">param</div><div class="v queue-param">${escapeHtml(JSON.stringify(row.param))}</div></div>
        </div>
        ${row.failureReason ? `<div class="req-fail">${escapeHtml(row.failureReason)}</div>` : ""}
      </article>
    `;
  }

  function requestsByJobCode(requests) {
    const map = new Map();
    requests.forEach((row) => {
      if (!map.has(row.jobCode)) map.set(row.jobCode, []);
      map.get(row.jobCode).push(row);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }

  function openHangfireGroup(date, key) {
    const group = runGroupsForDay(date).find((item) => item.key === key);
    if (!group) return;
    selectedQueue = { date, key };
    const run = group.run;
    const title = run && run.runId ? run.runId : (run ? "Unmapped poller slot" : "Not picked yet");
    const openLog = run && run.runId ? `<a class="open-log" href="${hangfireLogUrl(run.runId)}">Open Hangfire log</a>` : "";
    const sections = requestsByJobCode(group.requests).map(([jobCode, rows]) => `
      <section class="run-block">
        <div class="run-block-head">
          <div>
            <h3>${escapeHtml(jobCode)}</h3>
            <div class="muted">${rows.length} request${rows.length === 1 ? "" : "s"}</div>
          </div>
        </div>
        ${rows.map(requestCard).join("")}
      </section>
    `).join("");
    $("drawer").innerHTML = `
      <div class="drawer-head">
        <button class="drawer-close" type="button" id="close-drawer">×</button>
        ${openLog}
        <h2>${escapeHtml(title)}</h2>
        <div class="muted">${run && run.at ? fmtWhen(run.at) : window.DateFmt.date(date)} · ${group.counts.total} request${group.counts.total === 1 ? "" : "s"} from dbo.background_process_request</div>
      </div>
      <div class="meta-grid">
        <div><div class="k">Hangfire status</div><div class="v">${run ? escapeHtml(run.status) : "Pending"}</div></div>
        <div><div class="k">Duration</div><div class="v">${run && run.duration ? escapeHtml(run.duration) : "—"}</div></div>
        <div><div class="k">Job codes</div><div class="v">${escapeHtml(group.codes.join(", "))}</div></div>
        <div><div class="k">Failed</div><div class="v">${group.counts.Failed}</div></div>
      </div>
      <div class="drawer-body">${sections}</div>
    `;
    $("drawer").classList.add("open");
    $("drawer").setAttribute("aria-hidden", "false");
    $("backdrop").classList.add("open");
    $("close-drawer").addEventListener("click", closeDrawer);
    renderQueue();
  }

  function renderRuns() {
    const runs = data.jobs
      .flatMap((job) => (job.lastRuns || []).map((run) => ({ ...run, job })))
      .sort((a, b) => String(b.at).localeCompare(String(a.at)));

    const rows = runs.map((run) => `
      <tr data-id="${run.job.id}" data-run="${run.runId}">
        <td>${fmtWhen(run.at)}</td>
        <td>
          <div class="job-name">${run.job.name}</div>
          <div class="job-method">${run.runId}</div>
        </td>
        <td><span class="${statusClass(run.status)}">${run.status}</span></td>
        <td>${run.duration}</td>
      </tr>
    `).join("");

    $("view").innerHTML = `
      <div class="toolbar">
        <span class="hint">Click a run to open that job’s 10-day page, then the log for this execution.</span>
      </div>
      <div style="overflow:auto">
        <table>
          <thead>
            <tr>
              <th>Started (IST)</th>
              <th>Job / run</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    $("view").querySelectorAll("tbody tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.getAttribute("data-id");
        const runId = row.getAttribute("data-run");
        location.href = "job.html?id=" + encodeURIComponent(id) + "&run=" + encodeURIComponent(runId);
      });
    });
  }

  function closeDrawer() {
    const wasQueue = view === "queue" && selectedQueue;
    selectedQueue = null;
    $("drawer").classList.remove("open");
    $("drawer").setAttribute("aria-hidden", "true");
    $("backdrop").classList.remove("open");
    if (wasQueue) renderQueue();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function render() {
    if (view === "queue" && !SHOW_QUEUE) view = "jobs";
    const title = $("page-title");
    if (view === "queue") title.textContent = "User-triggered queue";
    else if (view === "runs") title.textContent = "Recent runs";
    else title.textContent = "Process health";

    if (view !== "queue") {
      $("days").hidden = true;
      $("days").innerHTML = "";
    }

    const active = document.activeElement;
    const restoreSearch = active && (active.id === "search" || active.id === "queue-search");
    const caret = restoreSearch ? active.selectionStart : null;
    renderKpis();
    $("kpis").classList.toggle("queue-off", !SHOW_QUEUE && view !== "queue");
    if (view === "jobs") renderJobs();
    else if (view === "queue") renderQueue();
    else renderRuns();
    if (restoreSearch) {
      const el = $(active.id);
      el.focus();
      if (caret != null) el.setSelectionRange(caret, caret);
    }
  }

  document.querySelectorAll(".nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-view");
      if (next === "queue" && !SHOW_QUEUE) return;
      view = next;
      location.hash = view === "jobs" ? "" : view;
      document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("active", b === btn));
      closeDrawer();
      render();
    });
  });
  $("backdrop").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  const navQueue = $("nav-queue");
  if (navQueue) navQueue.hidden = !SHOW_QUEUE;

  const hash = (location.hash || "").replace("#", "");
  if (hash === "queue" && !SHOW_QUEUE) {
    view = "jobs";
    location.hash = "";
  } else if (hash === "queue" || hash === "runs") {
    view = hash;
    document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("active", b.getAttribute("data-view") === view));
  }

  renderClock();
  renderMeta();
  renderKpis();
  render();
})();
