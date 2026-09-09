(function () {
  const data = window.DASHBOARD_DATA;
  const history = window.JobHistory;
  const params = new URLSearchParams(location.search);
  const jobId = params.get("id");
  const openRunId = params.get("run");
  const job = (data.jobs || []).find((item) => item.id === jobId);

  const $ = (id) => document.getElementById(id);
  const navQueue = $("nav-queue");
  if (navQueue) navQueue.hidden = !data.showUserTriggeredQueue;

  let selectedDay = "all";
  let statusFilter = "All";
  let query = "";
  let page = 1;
  const PAGE_SIZE = 50;
  let selectedRunId = openRunId;

  function statusClass(status) {
    return `status ${status}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  if (!job) {
    $("page-title").textContent = "Job not found";
    $("page-sub").textContent = "Return to the job list and pick a recurring job.";
    $("kpis").innerHTML = "";
    $("view").innerHTML = `<div class="empty">No job matches <span class="job-method">${escapeHtml(jobId || "")}</span></div>`;
    return;
  }

  const allRuns = history.runsFor(job);
  const stats = history.statsFor(allRuns);
  const days = history.byDay(allRuns);
  const useDayFilter = allRuns.length > 200;

  if (useDayFilter) selectedDay = days[days.length - 1].date;

  document.title = `${job.name} · 10-day history`;
  $("clock").textContent = "IST sample · " + window.DateFmt.dateTime("2026-09-09 16:56:00", { seconds: false });
  $("side-meta").innerHTML = `
    Hangfire keeps ${history.RETENTION_DAYS} days<br />
    ${escapeHtml(history.windowLabel)}<br />
    ${job.enabled ? "Scheduled" : "Disabled"}
  `;
  $("page-title").textContent = job.name;
  $("page-sub").textContent = `${job.schedule} · ${job.method}`;

  function renderKpis() {
    $("kpis").innerHTML = `
      <article class="kpi"><div class="label">Called (10 days)</div><div class="value">${stats.total}</div></article>
      <article class="kpi ok"><div class="label">Succeeded</div><div class="value">${stats.succeeded}</div></article>
      <article class="kpi bad"><div class="label">Failed</div><div class="value">${stats.failed}</div></article>
      <article class="kpi running"><div class="label">Running</div><div class="value">${stats.running}</div></article>
      <article class="kpi"><div class="label">Success rate</div><div class="value">${stats.total ? stats.successRate + "%" : "—"}</div></article>
      <article class="kpi"><div class="label">Avg duration</div><div class="value avg">${stats.avgDuration}</div></article>
    `;
  }

  function renderDays() {
    const max = Math.max(1, ...days.map((d) => d.total));
    const chips = [`<button type="button" class="day-chip ${selectedDay === "all" ? "active" : ""}" data-day="all">All 10 days<span>${stats.total}</span></button>`]
      .concat(days.map((day) => {
        const label = window.DateFmt.dayMonth(day.date);
        const fail = day.failed ? ` · ${day.failed} failed` : "";
        return `
          <button type="button" class="day-chip ${selectedDay === day.date ? "active" : ""} ${day.failed ? "has-fail" : ""}" data-day="${day.date}">
            ${label}
            <span>${day.total}${fail}</span>
            <i style="height:${Math.max(6, Math.round((day.total / max) * 28))}px"></i>
          </button>
        `;
      }))
      .join("");

    $("days").innerHTML = `
      <div class="toolbar">
        <span class="hint">Hangfire job records expire after 10 days. Click a day to filter executions.</span>
      </div>
      <div class="day-row">${chips}</div>
    `;
    $("days").querySelectorAll("[data-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDay = btn.getAttribute("data-day");
        page = 1;
        renderList();
        renderDays();
      });
    });
  }

  function filteredRuns() {
    return allRuns.filter((run) => {
      if (selectedDay !== "all" && run.date !== selectedDay) return false;
      if (statusFilter !== "All" && run.status !== statusFilter) return false;
      if (!query) return true;
      return `${run.runId} ${run.at} ${window.DateFmt.dateTime(run.at)} ${run.status}`.toLowerCase().includes(query);
    });
  }

  function renderList() {
    const runs = filteredRuns();
    const pages = Math.max(1, Math.ceil(runs.length / PAGE_SIZE));
    if (page > pages) page = pages;
    const slice = runs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const statuses = ["All", "Succeeded", "Failed", "Running"]
      .map((s) => `<option ${s === statusFilter ? "selected" : ""}>${s}</option>`)
      .join("");

    const rows = slice.map((run) => `
      <tr data-run="${run.runId}" class="${run.runId === selectedRunId ? "selected" : ""}">
        <td>${window.DateFmt.dateTime(run.at)}</td>
        <td class="job-method">${run.runId}</td>
        <td><span class="${statusClass(run.status)}">${run.status}</span></td>
        <td>${run.duration}</td>
        <td>${window.DateFmt.dateTime(run.endedAt)}</td>
      </tr>
    `).join("");

    $("view").innerHTML = `
      <div class="toolbar">
        <input id="search" type="search" placeholder="Search run id or time" value="${escapeHtml(query)}" />
        <select id="status">${statuses}</select>
        <span class="hint">${runs.length} executions · click a row for that run’s step log</span>
      </div>
      <div style="overflow:auto">
        <table>
          <thead>
            <tr>
              <th>Started (IST)</th>
              <th>Run id</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Ended</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="5" class="empty">No executions in this 10-day window.</td></tr>`}</tbody>
        </table>
      </div>
      <div class="pager">
        <button type="button" id="prev" ${page <= 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${page} of ${pages}</span>
        <button type="button" id="next" ${page >= pages ? "disabled" : ""}>Next</button>
      </div>
    `;

    $("search").addEventListener("input", (e) => {
      query = e.target.value.trim().toLowerCase();
      page = 1;
      const caret = e.target.selectionStart;
      renderList();
      const el = $("search");
      el.focus();
      el.setSelectionRange(caret, caret);
    });
    $("status").addEventListener("change", (e) => {
      statusFilter = e.target.value;
      page = 1;
      renderList();
    });
    $("prev").addEventListener("click", () => { page -= 1; renderList(); });
    $("next").addEventListener("click", () => { page += 1; renderList(); });
    $("view").querySelectorAll("tbody tr[data-run]").forEach((row) => {
      row.addEventListener("click", () => openRun(row.getAttribute("data-run")));
    });
  }

  function openRun(runId) {
    const run = allRuns.find((item) => item.runId === runId);
    if (!run) return;
    selectedRunId = runId;
    const steps = history.stepsFor(job, run);
    const stepHtml = steps.map((step) => renderStep(step, 0)).join("");

    $("drawer").innerHTML = `
      <div class="drawer-head">
        <button class="drawer-close" type="button" id="close-drawer">×</button>
        <span class="${statusClass(run.status)}">${run.status}</span>
        <h2>Execution log</h2>
        <div class="muted">${escapeHtml(job.name)}</div>
      </div>
      <div class="meta-grid">
        <div><div class="k">Run id</div><div class="v job-method">${run.runId}</div></div>
        <div><div class="k">Duration</div><div class="v">${run.duration}</div></div>
        <div><div class="k">Started</div><div class="v">${window.DateFmt.dateTime(run.at)}</div></div>
        <div><div class="k">Ended</div><div class="v">${window.DateFmt.dateTime(run.endedAt)}</div></div>
      </div>
      <div class="drawer-body">
        <div class="log-head">
          <span class="log-col-name">Step</span>
          <span class="log-col-start">Start</span>
          <span class="log-col-end">End</span>
          <span class="log-col-gap">Gap</span>
          <span class="log-col-total">Total</span>
        </div>
        <ul class="log-tree">${stepHtml || `<li class="muted">No step parameters for this run.</li>`}</ul>
      </div>
    `;
    $("drawer").classList.add("open");
    $("drawer").setAttribute("aria-hidden", "false");
    $("backdrop").classList.add("open");
    $("close-drawer").addEventListener("click", closeDrawer);
    $("drawer").querySelectorAll(".log-node.has-kids > .log-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        row.closest(".log-node").classList.toggle("open");
      });
    });
    renderList();
  }

  function renderStep(step, depth) {
    const fail = /fail/i.test(step.key) || /fail/i.test(step.message);
    const hasChildren = step.children && step.children.length;
    const kids = hasChildren
      ? `<ul class="log-sub">${step.children.map((child) => renderStep(child, depth + 1)).join("")}</ul>`
      : "";
    const extraMsg = step.detail || (step.message && step.message !== "Start-End" ? step.message : "");
    const extra = extraMsg && !hasChildren
      ? `<div class="log-extra">${escapeHtml(window.DateFmt.inText(extraMsg))}</div>`
      : "";
    return `
      <li class="log-node ${hasChildren ? "has-kids" : "leaf"} ${fail ? "fail" : ""}" style="--depth:${depth}">
        <div class="log-row ${hasChildren ? "is-parent" : ""}">
          <span class="log-name"><span class="log-toggle" aria-hidden="true"></span>${escapeHtml(step.key)}${extraMsg && hasChildren ? `<em class="log-count">${escapeHtml(window.DateFmt.inText(extraMsg))}</em>` : ""}</span>
          <span class="log-col-start">${step.time || "—"}</span>
          <span class="log-col-end">${step.endTime || "—"}</span>
          <span class="log-col-gap">${step.sinceLast || "—"}</span>
          <span class="log-col-total">${step.sinceStart || "—"}</span>
        </div>
        ${extra}
        ${kids}
      </li>
    `;
  }

  function closeDrawer() {
    selectedRunId = null;
    $("drawer").classList.remove("open");
    $("drawer").setAttribute("aria-hidden", "true");
    $("backdrop").classList.remove("open");
    renderList();
  }

  $("backdrop").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  renderKpis();
  renderDays();
  renderList();
  if (openRunId) {
    const run = allRuns.find((item) => item.runId === openRunId);
    if (run && useDayFilter) {
      selectedDay = run.date;
      renderDays();
      renderList();
    }
    openRun(openRunId);
  }
})();
