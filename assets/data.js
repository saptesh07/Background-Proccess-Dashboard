/* Hardcoded design data — mirrors DailySchedulars Hangfire jobs + HangfireJobStepLog. */
window.DASHBOARD_DATA = {
  showUserTriggeredQueue: true,
  generatedAt: "2026-09-09T16:56:00+05:30",
  timezone: "India Standard Time",
  server: "DailySchedulars",
  workerCount: 5,
  logNote:
    "Each step is stored as a Hangfire job parameter: message | since last step | since job start. The same line is also written to ProjectLog/DailySchedular_yyyyMMdd.txt.",

  kpis: {
    running: 1,
    succeeded24h: 41,
    failed24h: 1,
    skipped24h: 0,
    userQueuePending: 4,
    userQueueProcessing: 1
  },

  categories: [
    "All",
    "Attendance",
    "Scoring & Portfolio",
    "Reports & Email",
    "Notifications",
    "Data Sync",
    "Content & Links",
    "User & Access",
    "Big Process",
    "User Triggered"
  ],

  jobs: [
    {
      id: "process-pending-notification",
      name: "Process Pending Notifications",
      method: "ProcessPendingNotification",
      category: "Notifications",
      cron: "* * * * *",
      schedule: "Every minute",
      enabled: true,
      lastStatus: "Running",
      lastRun: "2026-09-09 16:55:00",
      nextRun: "2026-09-09 16:56:00",
      duration: "—",
      summary: "NotificationActivity.ProcessPendingJobs()",
      lastRuns: [
        { at: "2026-09-09 16:55:00", status: "Running", duration: "56s so far", runId: "hf-88421" },
        { at: "2026-09-09 16:54:00", status: "Succeeded", duration: "4s", runId: "hf-88410" },
        { at: "2026-09-09 16:53:00", status: "Succeeded", duration: "3s", runId: "hf-88399" }
      ],
      steps: [
        { time: "16:55:00", key: "ProcessPendingNotification", message: "Started", sinceLast: "+0s", sinceStart: "+0s" }
      ]
    },
    {
      id: "sync-user-access-details-tbl",
      name: "Sync User Access Details",
      method: "SyncUserAccessDetailsTbl",
      category: "Data Sync",
      cron: "*/5 * * * *",
      schedule: "Every 5 minutes",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 16:50:00",
      nextRun: "2026-09-09 16:55:00",
      duration: "18s",
      summary: "p_update_user_details on Main + Process, then row-count check",
      lastRuns: [
        { at: "2026-09-09 16:50:00", status: "Succeeded", duration: "18s", runId: "hf-88380" },
        { at: "2026-09-09 16:45:00", status: "Succeeded", duration: "21s", runId: "hf-88340" },
        { at: "2026-09-09 16:40:00", status: "Succeeded", duration: "16s", runId: "hf-88301" }
      ],
      steps: [
        { time: "16:50:00", key: "SyncUserAccessDetails Started", message: "", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:50:00", key: "p_update_user_details Main Server Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:50:07", key: "p_update_user_details Main Server End", message: "SP Call", sinceLast: "+7s", sinceStart: "+7s" },
        { time: "16:50:07", key: "p_update_user_details Main Process Server Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+7s" },
        { time: "16:50:16", key: "p_update_user_details Main Process Server End", message: "SP Call", sinceLast: "+9s", sinceStart: "+16s" },
        { time: "16:50:17", key: "Main Server Count", message: "1842031", sinceLast: "+1s", sinceStart: "+17s" },
        { time: "16:50:18", key: "Proccess Server Count", message: "1842031", sinceLast: "+1s", sinceStart: "+18s" },
        { time: "16:50:18", key: "SyncUserAccessDetails Completed", message: "", sinceLast: "+0s", sinceStart: "+18s" }
      ]
    },
    {
      id: "run-otp-clear-data",
      name: "Clear Expired OTP",
      method: "RunOtpClearData",
      category: "User & Access",
      cron: "*/15 * * * *",
      schedule: "Every 15 minutes",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 16:45:00",
      nextRun: "2026-09-09 17:00:00",
      duration: "2s",
      summary: "p_delete_expired_otp_transaction on Main dbo",
      lastRuns: [
        { at: "2026-09-09 16:45:00", status: "Succeeded", duration: "2s", runId: "hf-88342" },
        { at: "2026-09-09 16:30:00", status: "Succeeded", duration: "2s", runId: "hf-88290" }
      ],
      steps: [
        { time: "16:45:00", key: "RunOtpClearData", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:45:00", key: "p_delete_expired_otp_transaction Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:45:02", key: "p_delete_expired_otp_transaction End", message: "SP Call", sinceLast: "+2s", sinceStart: "+2s" }
      ]
    },
    {
      id: "user-triggered-background-process",
      name: "User Triggered Background Process",
      method: "UserTriggeredBackgroundProcessJob",
      category: "User Triggered",
      cron: "*/30 * * * *",
      schedule: "Every 30 minutes",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 16:30:00",
      nextRun: "2026-09-09 17:00:00",
      duration: "1m 12s",
      summary: "Picks Pending rows from dbo.background_process_request, groups by job_code + param",
      lastRuns: [
        { at: "2026-09-09 16:30:00", status: "Succeeded", duration: "1m 12s", runId: "hf-88288" },
        { at: "2026-09-09 16:00:00", status: "Succeeded", duration: "44s", runId: "hf-88120" }
      ],
      steps: [
        { time: "16:30:00", key: "UserTriggeredBackgroundProcess", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:30:01", key: "UserTriggeredBackgroundProcess", message: "Pending jobs: 3, groups: 3", sinceLast: "+1s", sinceStart: "+1s" },
        { time: "16:30:01", key: "job_10482", message: "Processing P_PORTFOLIO_USER_DETAILS_DEFAULT_SCHEDULER group_size=1", sinceLast: "+0s", sinceStart: "+1s" },
        { time: "16:30:01", key: "p_portfolio_user_details_default_scheduler Started", message: "user_id=88211, user_name=anita.deshmukh, school_id=441", sinceLast: "+0s", sinceStart: "+1s" },
        { time: "16:30:38", key: "p_portfolio_user_details_default_scheduler End", message: "SP Call", sinceLast: "+37s", sinceStart: "+38s" },
        { time: "16:30:38", key: "job_10482", message: "Success group_size=1", sinceLast: "+0s", sinceStart: "+38s" },
        { time: "16:30:38", key: "job_10490", message: "Processing p_portfolio_details_schedular_update group_size=1", sinceLast: "+0s", sinceStart: "+38s" },
        { time: "16:30:38", key: "p_portfolio_details_schedular_update Started", message: "USER_ID=77102", sinceLast: "+0s", sinceStart: "+38s" },
        { time: "16:31:04", key: "p_portfolio_details_schedular_update End", message: "SP Call", sinceLast: "+26s", sinceStart: "+1.04min" },
        { time: "16:31:04", key: "job_10490", message: "Success group_size=1", sinceLast: "+0s", sinceStart: "+1.04min" },
        { time: "16:31:04", key: "job_10501", message: "Processing UPDATE_AI_LINK_METRICS_VIEWS_COUNT group_size=12", sinceLast: "+0s", sinceStart: "+1.04min" },
        { time: "16:31:04", key: "UPDATE_AI_LINK_METRICS_VIEWS_COUNT Started", message: "LINK_ID=722431, increment=12", sinceLast: "+0s", sinceStart: "+1.04min" },
        { time: "16:31:12", key: "UPDATE_AI_LINK_METRICS_VIEWS_COUNT End", message: "SP Call", sinceLast: "+8s", sinceStart: "+1.12min" },
        { time: "16:31:12", key: "job_10501", message: "Success group_size=12", sinceLast: "+0s", sinceStart: "+1.12min" },
        { time: "16:31:12", key: "UserTriggeredBackgroundProcess", message: "Completed", sinceLast: "+0s", sinceStart: "+1.12min" }
      ]
    },
    {
      id: "attendance-daily-data",
      name: "Attendance Daily Data",
      method: "RunAttendenceDailyData",
      category: "Attendance",
      cron: "0 8-16 * * *",
      schedule: "Hourly from 8:00 AM to 4:00 PM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 16:00:00",
      nextRun: "2026-09-10 08:00:00",
      duration: "3m 22s",
      summary: "P_ATTENDENCE_DIALY_DATA on report schema (Process DB)",
      lastRuns: [
        { at: "2026-09-09 16:00:00", status: "Succeeded", duration: "3m 22s", runId: "hf-88110" },
        { at: "2026-09-09 15:00:00", status: "Succeeded", duration: "3m 08s", runId: "hf-87640" }
      ],
      steps: [
        { time: "16:00:00", key: "RunAttendenceDailyData", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:00:00", key: "P_ATTENDENCE_DIALY_DATA Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "16:03:22", key: "P_ATTENDENCE_DIALY_DATA End", message: "SP Call", sinceLast: "+3.22min", sinceStart: "+3.22min" }
      ]
    },
    {
      id: "post-of-month-score",
      name: "Post of Month Score",
      method: "RunPostOfMonthScore",
      category: "Scoring & Portfolio",
      cron: "0 2 * * *",
      schedule: "Daily at 2:00 AM IST",
      enabled: true,
      lastStatus: "Failed",
      lastRun: "2026-09-09 02:00:04",
      nextRun: "2026-09-10 02:00:00",
      duration: "41m 08s",
      summary: "Sequential CALL user_rollup.p_post_of_month_score_* then p_get_pom_mark_not_for_pom_v2",
      lastRuns: [
        { at: "2026-09-09 02:00:04", status: "Failed", duration: "41m 08s", runId: "hf-80112" },
        { at: "2026-09-08 02:00:03", status: "Succeeded", duration: "18m 44s", runId: "hf-76001" },
        { at: "2026-09-07 02:00:02", status: "Succeeded", duration: "19m 11s", runId: "hf-72110" }
      ],
      steps: [
        { time: "02:00:04", key: "RunPostOfMonthScore", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "02:00:04", key: "p_post_of_month_score_prep Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "02:04:11", key: "p_post_of_month_score_prep End", message: "SP Call", sinceLast: "+4.07min", sinceStart: "+4.07min" },
        { time: "02:04:11", key: "p_post_of_month_score_ts Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+4.07min" },
        { time: "02:12:40", key: "p_post_of_month_score_ts End", message: "SP Call", sinceLast: "+8.29min", sinceStart: "+12.36min" },
        { time: "02:12:40", key: "p_post_of_month_score_tlm Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+12.36min" },
        { time: "02:21:05", key: "p_post_of_month_score_tlm End", message: "SP Call", sinceLast: "+8.25min", sinceStart: "+21.01min" },
        { time: "02:21:05", key: "p_post_of_month_score_ca Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+21.01min" },
        { time: "02:33:48", key: "p_post_of_month_score_ca End", message: "SP Call", sinceLast: "+12.43min", sinceStart: "+33.44min" },
        { time: "02:33:48", key: "p_post_of_month_score_percentile Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+33.44min" },
        { time: "02:41:12", key: "RunPostOfMonthScore", message: "failed: 57014: canceling statement due to statement timeout | Exception while executing command CALL user_rollup.p_post_of_month_score_percentile();", sinceLast: "+7.24min", sinceStart: "+41.08min" }
      ]
    },
    {
      id: "attendance-clear-form-response",
      name: "Attendance Clear Form Response",
      method: "RunAttendanceClearFormResponse",
      category: "Attendance",
      cron: "0 2 * * *",
      schedule: "Daily at 2:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 02:00:05",
      nextRun: "2026-09-10 02:00:00",
      duration: "1m 06s",
      summary: "Checks p_check_attendence_data for yesterday, then either clears form response or backfills manually",
      lastRuns: [
        { at: "2026-09-09 02:00:05", status: "Succeeded", duration: "1m 06s", runId: "hf-80114" },
        { at: "2026-09-08 02:00:06", status: "Succeeded", duration: "8m 40s", runId: "hf-76004" }
      ],
      steps: [
        { time: "02:00:05", key: "RunAttendanceClearFormResponse", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "02:00:05", key: "p_check_attendence_data Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "02:00:08", key: "p_check_attendence_data Result: ", message: "True", sinceLast: "+3s", sinceStart: "+3s" },
        { time: "02:00:08", key: "p_check_attendence_data End", message: "SP Call", sinceLast: "+0s", sinceStart: "+3s" },
        { time: "02:00:08", key: "RunAttendanceClearFormResponse", message: "Started", sinceLast: "+0s", sinceStart: "+3s" },
        { time: "02:00:08", key: "p_attendance_clear_form_response Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+3s" },
        { time: "02:01:11", key: "p_attendance_clear_form_response End", message: "SP Call", sinceLast: "+1.03min", sinceStart: "+1.06min" }
      ]
    },
    {
      id: "big-process-windows-service",
      name: "Big Process Windows Service",
      method: "BigProcessWindowsService",
      category: "Big Process",
      cron: "0 1 * * *",
      schedule: "Daily at 1:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 01:00:02",
      nextRun: "2026-09-10 01:00:00",
      duration: "2h 14m",
      summary: "Certificates, Portfolio, AI weekly/monthly, Award, POM — each step can be toggled in BigProcessSteps",
      lastRuns: [
        { at: "2026-09-09 01:00:02", status: "Succeeded", duration: "2h 14m", runId: "hf-79801" },
        { at: "2026-09-08 01:00:01", status: "Succeeded", duration: "2h 08m", runId: "hf-75600" }
      ],
      steps: [
        { time: "01:00:02", key: "BigProcessWindowsService", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "01:00:02", key: "UpdateUserCertificateJob", message: "Start", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "01:00:02", key: "p_user_final_certificate_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "01:08:20", key: "p_user_final_certificate_big_process End", message: "4 batches", sinceLast: "+8.18min", sinceStart: "+8.18min" },
        { time: "01:08:20", key: "p_user_final_certificate_big_process_partial Started", message: "4 batches", sinceLast: "+0s", sinceStart: "+8.18min" },
        ...rangeLogs("p_user_final_certificate_big_process_partial", [
          { range: "0-499", start: "01:08:20", end: "01:10:02", ss0: "+8.18min", gap: "+1.42min", ss1: "+10.00min" },
          { range: "500-999", start: "01:10:02", end: "01:11:44", ss0: "+10.00min", gap: "+1.42min", ss1: "+11.42min" },
          { range: "1000-1499", start: "01:11:44", end: "01:13:28", ss0: "+11.42min", gap: "+1.44min", ss1: "+13.26min" },
          { range: "1500-1999", start: "01:13:28", end: "01:15:10", ss0: "+13.26min", gap: "+1.42min", ss1: "+15.08min" }
        ]),
        { time: "01:15:10", key: "p_user_final_certificate_big_process_partial End", message: "4 batches", sinceLast: "+6.50min", sinceStart: "+15.08min" },
        { time: "01:15:10", key: "p_user_final_certificate_big_process_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+15.08min" },
        { time: "01:18:38", key: "p_user_final_certificate_big_process_end End", message: "SP Call", sinceLast: "+3.28min", sinceStart: "+18.38min" },
        { time: "01:18:38", key: "UpdateUserCertificateJob", message: "End", sinceLast: "+18.38min", sinceStart: "+18.38min" },
        { time: "01:18:38", key: "PortfolioActivityListJob", message: "Start", sinceLast: "+0s", sinceStart: "+18.38min" },
        { time: "01:18:38", key: "p_portfolio_activity_list_schedular_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+18.38min" },
        { time: "01:28:50", key: "p_portfolio_activity_list_schedular_big_process End", message: "5 batches", sinceLast: "+10.12min", sinceStart: "+28.50min" },
        { time: "01:28:50", key: "p_portfolio_activity_list_schedular_big_process_partial Started", message: "5 batches", sinceLast: "+0s", sinceStart: "+28.50min" },
        ...rangeLogs("p_portfolio_activity_list_schedular_big_process_partial", [
          { range: "0-499", start: "01:28:50", end: "01:31:20", ss0: "+28.50min", gap: "+2.30min", ss1: "+31.18min" },
          { range: "500-999", start: "01:31:20", end: "01:33:50", ss0: "+31.18min", gap: "+2.30min", ss1: "+33.48min" },
          { range: "1000-1499", start: "01:33:50", end: "01:36:20", ss0: "+33.48min", gap: "+2.30min", ss1: "+36.18min" },
          { range: "1500-1999", start: "01:36:20", end: "01:38:50", ss0: "+36.18min", gap: "+2.30min", ss1: "+38.48min" },
          { range: "2000-2499", start: "01:38:50", end: "01:41:20", ss0: "+38.48min", gap: "+2.30min", ss1: "+41.18min" }
        ]),
        { time: "01:41:20", key: "p_portfolio_activity_list_schedular_big_process_partial End", message: "5 batches", sinceLast: "+12.30min", sinceStart: "+41.18min" },
        { time: "01:41:20", key: "p_portfolio_activity_list_schedular_big_process_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+41.18min" },
        { time: "01:47:10", key: "p_portfolio_activity_list_schedular_big_process_end End", message: "SP Call", sinceLast: "+5.52min", sinceStart: "+47.10min" },
        { time: "01:47:10", key: "PortfolioActivityListJob", message: "End", sinceLast: "+28.32min", sinceStart: "+47.10min" },
        { time: "01:47:10", key: "PortfolioDetailsJob", message: "Start", sinceLast: "+0s", sinceStart: "+47.10min" },
        { time: "01:47:10", key: "p_portfolio_details_schedular_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+47.10min" },
        { time: "01:55:40", key: "p_portfolio_details_schedular_big_process End", message: "4 batches", sinceLast: "+8.30min", sinceStart: "+55.40min" },
        { time: "01:55:40", key: "p_portfolio_details_schedular_big_process_partial Started", message: "4 batches", sinceLast: "+0s", sinceStart: "+55.40min" },
        ...rangeLogs("p_portfolio_details_schedular_big_process_partial", [
          { range: "0-499", start: "01:55:40", end: "01:58:05", ss0: "+55.40min", gap: "+2.25min", ss1: "+58.03min" },
          { range: "500-999", start: "01:58:05", end: "02:00:28", ss0: "+58.03min", gap: "+2.23min", ss1: "+60.26min" },
          { range: "1000-1499", start: "02:00:28", end: "02:02:50", ss0: "+60.26min", gap: "+2.22min", ss1: "+62.48min" },
          { range: "1500-1999", start: "02:02:50", end: "02:05:10", ss0: "+62.48min", gap: "+2.20min", ss1: "+65.08min" }
        ]),
        { time: "02:05:10", key: "p_portfolio_details_schedular_big_process_partial End", message: "4 batches", sinceLast: "+9.30min", sinceStart: "+65.08min" },
        { time: "02:05:10", key: "p_portfolio_details_schedular_big_process_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+65.08min" },
        { time: "02:09:55", key: "p_portfolio_details_schedular_big_process_end End", message: "SP Call", sinceLast: "+4.45min", sinceStart: "+69.53min" },
        { time: "02:09:55", key: "PortfolioDetailsJob", message: "End", sinceLast: "+22.43min", sinceStart: "+69.53min" },
        { time: "02:09:55", key: "ExecuteAIWeeklySchedular", message: "Start", sinceLast: "+0s", sinceStart: "+69.53min" },
        { time: "02:09:55", key: "p_ai_sch_link_metrics_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+69.53min" },
        { time: "02:16:00", key: "p_ai_sch_link_metrics_big_process End", message: "3 batches", sinceLast: "+6.05min", sinceStart: "+75.58min" },
        { time: "02:16:00", key: "p_ai_sch_link_metrics_big_process_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+75.58min" },
        ...rangeLogs("p_ai_sch_link_metrics_big_process_partial", [
          { range: "0-499", start: "02:16:00", end: "02:18:00", ss0: "+75.58min", gap: "+2.00min", ss1: "+77.58min" },
          { range: "500-999", start: "02:18:00", end: "02:20:00", ss0: "+77.58min", gap: "+2.00min", ss1: "+79.58min" },
          { range: "1000-1499", start: "02:20:00", end: "02:22:10", ss0: "+79.58min", gap: "+2.10min", ss1: "+82.08min" }
        ]),
        { time: "02:22:10", key: "p_ai_sch_link_metrics_big_process_partial End", message: "3 batches", sinceLast: "+6.10min", sinceStart: "+82.08min" },
        { time: "02:22:10", key: "p_ai_sch_user_metrics_reader_lifetime_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+82.08min" },
        { time: "02:24:40", key: "p_ai_sch_user_metrics_reader_lifetime_big_process End", message: "3 batches", sinceLast: "+2.30min", sinceStart: "+84.38min" },
        { time: "02:24:40", key: "p_ai_sch_user_metrics_reader_lifetime_big_process_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+84.38min" },
        ...rangeLogs("p_ai_sch_user_metrics_reader_lifetime_big_process_partial", [
          { range: "0-499", start: "02:24:40", end: "02:26:20", ss0: "+84.38min", gap: "+1.40min", ss1: "+86.18min" },
          { range: "500-999", start: "02:26:20", end: "02:28:00", ss0: "+86.18min", gap: "+1.40min", ss1: "+87.58min" },
          { range: "1000-1499", start: "02:28:00", end: "02:30:00", ss0: "+87.58min", gap: "+2.00min", ss1: "+89.58min" }
        ]),
        { time: "02:30:00", key: "p_ai_sch_user_metrics_reader_lifetime_big_process_partial End", message: "3 batches", sinceLast: "+5.20min", sinceStart: "+89.58min" },
        { time: "02:30:00", key: "p_ai_sch_user_metrics_engage_lifetime_big_process_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+89.58min" },
        ...rangeLogs("p_ai_sch_user_metrics_engage_lifetime_big_process_partial", [
          { range: "0-499", start: "02:30:00", end: "02:32:00", ss0: "+89.58min", gap: "+2.00min", ss1: "+91.58min" },
          { range: "500-999", start: "02:32:00", end: "02:34:00", ss0: "+91.58min", gap: "+2.00min", ss1: "+93.58min" },
          { range: "1000-1499", start: "02:34:00", end: "02:36:00", ss0: "+93.58min", gap: "+2.00min", ss1: "+95.58min" }
        ]),
        { time: "02:36:00", key: "p_ai_sch_user_metrics_engage_lifetime_big_process_partial End", message: "3 batches", sinceLast: "+6.00min", sinceStart: "+95.58min" },
        { time: "02:36:00", key: "p_ai_sch_user_metrics_reader_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+95.58min" },
        { time: "02:38:20", key: "p_ai_sch_user_metrics_reader_big_process End", message: "SP Call", sinceLast: "+2.20min", sinceStart: "+98.18min" },
        { time: "02:38:20", key: "ExecuteAIWeeklySchedular", message: "End", sinceLast: "+28.25min", sinceStart: "+98.18min" },
        { time: "02:38:20", key: "ExecuteAIMonthlySchedular", message: "Start", sinceLast: "+0s", sinceStart: "+98.18min" },
        { time: "02:38:20", key: "p_ai_sch_user_metrics_monthly_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+98.18min" },
        { time: "02:42:00", key: "p_ai_sch_user_metrics_monthly_big_process End", message: "SP Call", sinceLast: "+3.40min", sinceStart: "+101.58min" },
        { time: "02:42:00", key: "p_ai_sch_user_metrics_editor_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+101.58min" },
        { time: "02:44:20", key: "p_ai_sch_user_metrics_editor_big_process End", message: "SP Call", sinceLast: "+2.20min", sinceStart: "+104.18min" },
        { time: "02:44:20", key: "p_ai_sch_user_metrics_author_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+104.18min" },
        { time: "02:46:40", key: "p_ai_sch_user_metrics_author_big_process End", message: "SP Call", sinceLast: "+2.20min", sinceStart: "+106.38min" },
        { time: "02:46:40", key: "p_ai_sch_school_matrics_monthly_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+106.38min" },
        { time: "02:51:04", key: "p_ai_sch_school_matrics_monthly_big_process End", message: "SP Call", sinceLast: "+4.24min", sinceStart: "+111.02min" },
        { time: "02:51:04", key: "ExecuteAIMonthlySchedular", message: "End", sinceLast: "+12.44min", sinceStart: "+111.02min" },
        { time: "02:51:04", key: "ExecuteAwardSchedular", message: "Start", sinceLast: "+0s", sinceStart: "+111.02min" },
        { time: "02:51:04", key: "p_award_user_lifetime_caculate_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+111.02min" },
        { time: "02:54:20", key: "p_award_user_lifetime_caculate_big_process End", message: "SP Call", sinceLast: "+3.16min", sinceStart: "+114.18min" },
        { time: "02:54:20", key: "p_award_master_teacher_caculate_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+114.18min" },
        { time: "02:57:02", key: "p_award_master_teacher_caculate_big_process End", message: "SP Call", sinceLast: "+2.42min", sinceStart: "+117.00min" },
        { time: "02:57:02", key: "p_award_link_contribution_caculate_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+117.00min" },
        { time: "02:59:40", key: "p_award_link_contribution_caculate_big_process End", message: "SP Call", sinceLast: "+2.38min", sinceStart: "+119.38min" },
        { time: "02:59:40", key: "p_award_invite_user_caculate_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+119.38min" },
        { time: "03:02:18", key: "p_award_invite_user_caculate_big_process End", message: "SP Call", sinceLast: "+2.38min", sinceStart: "+122.16min" },
        { time: "03:02:18", key: "ExecuteAwardSchedular", message: "End", sinceLast: "+11.14min", sinceStart: "+122.16min" },
        { time: "03:02:18", key: "ExecutePOMSchedular", message: "Start", sinceLast: "+0s", sinceStart: "+122.16min" },
        { time: "03:02:18", key: "p_get_feed_response Started", message: "monthly", sinceLast: "+0s", sinceStart: "+122.16min" },
        { time: "03:04:40", key: "p_get_feed_response End", message: "1840 rows", sinceLast: "+2.22min", sinceStart: "+124.38min" },
        { time: "03:04:40", key: "p_tt_top_teacher_monthly_score_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+124.38min" },
        { time: "03:07:10", key: "p_tt_top_teacher_monthly_score_big_process End", message: "SP Call", sinceLast: "+2.30min", sinceStart: "+127.08min" },
        { time: "03:07:10", key: "p_get_feed_response Started", message: "yearly", sinceLast: "+0s", sinceStart: "+127.08min" },
        { time: "03:08:20", key: "p_get_feed_response End", message: "920 rows", sinceLast: "+1.10min", sinceStart: "+128.18min" },
        { time: "03:08:20", key: "p_tt_top_teacher_yearly_score_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+128.18min" },
        { time: "03:10:02", key: "p_tt_top_teacher_yearly_score_big_process End", message: "SP Call", sinceLast: "+1.42min", sinceStart: "+130.00min" },
        { time: "03:10:02", key: "p_tt_top_teacher_lifetime_score_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+130.00min" },
        { time: "03:10:36", key: "p_tt_top_teacher_lifetime_score_big_process End", message: "SP Call", sinceLast: "+34s", sinceStart: "+130.34min" },
        { time: "03:10:36", key: "p_user_award_summary_big_process Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+130.34min" },
        { time: "03:11:10", key: "p_user_award_summary_big_process End", message: "4 batches", sinceLast: "+34s", sinceStart: "+131.08min" },
        { time: "03:11:10", key: "p_user_award_summary_big_process_partial_v1 Started", message: "4 batches", sinceLast: "+0s", sinceStart: "+131.08min" },
        ...rangeLogs("p_user_award_summary_big_process_partial_v1", [
          { range: "0-499", start: "03:11:10", end: "03:11:52", ss0: "+131.08min", gap: "+42s", ss1: "+131.50min" },
          { range: "500-999", start: "03:11:52", end: "03:12:34", ss0: "+131.50min", gap: "+42s", ss1: "+132.32min" },
          { range: "1000-1499", start: "03:12:34", end: "03:13:16", ss0: "+132.32min", gap: "+42s", ss1: "+133.14min" },
          { range: "1500-1999", start: "03:13:16", end: "03:13:50", ss0: "+133.14min", gap: "+34s", ss1: "+133.48min" }
        ]),
        { time: "03:13:50", key: "p_user_award_summary_big_process_partial_v1 End", message: "4 batches", sinceLast: "+2.40min", sinceStart: "+133.48min" },
        { time: "03:13:50", key: "p_user_award_summary_big_process_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+133.48min" },
        { time: "03:14:09", key: "p_user_award_summary_big_process_end End", message: "SP Call", sinceLast: "+19s", sinceStart: "+134.07min" },
        { time: "03:14:09", key: "ExecutePOMSchedular", message: "End", sinceLast: "+11.51min", sinceStart: "+134.07min" },
        { time: "03:14:09", key: "BigProcessWindowsService", message: "Completed", sinceLast: "+0s", sinceStart: "+134.07min" }
      ]
    },
    {
      id: "windows-feed-service",
      name: "Windows Feed Archive & Receiver",
      method: "WindowsFeedServiceJob",
      category: "Data Sync",
      cron: "0 0 * * *",
      schedule: "Daily at 12:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 00:00:03",
      nextRun: "2026-09-10 00:00:00",
      duration: "27m",
      summary: "FeedArchive then FeedReceiverProcess — job fails if either step fails",
      lastRuns: [
        { at: "2026-09-09 00:00:03", status: "Succeeded", duration: "27m", runId: "hf-79002" },
        { at: "2026-09-08 00:00:02", status: "Succeeded", duration: "24m 11s", runId: "hf-74880" }
      ],
      steps: [
        { time: "00:00:03", key: "WindowsFeedService", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "00:00:03", key: "FeedArchive", message: "Start", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "00:00:03", key: "p_feed_archive_v2 Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "00:08:00", key: "p_feed_archive_v2 End", message: "3 batches", sinceLast: "+7.57min", sinceStart: "+7.57min" },
        { time: "00:08:00", key: "p_feed_archive_core_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+7.57min" },
        ...rangeLogs("p_feed_archive_core_partial", [
          { range: "0-499", start: "00:08:00", end: "00:09:20", ss0: "+7.57min", gap: "+1.20min", ss1: "+9.17min" },
          { range: "500-999", start: "00:09:20", end: "00:10:40", ss0: "+9.17min", gap: "+1.20min", ss1: "+10.37min" },
          { range: "1000-1499", start: "00:10:40", end: "00:12:00", ss0: "+10.37min", gap: "+1.20min", ss1: "+11.57min" }
        ]),
        { time: "00:12:00", key: "p_feed_archive_core_partial End", message: "3 batches", sinceLast: "+4.00min", sinceStart: "+11.57min" },
        { time: "00:12:00", key: "p_feed_archive_user_prep Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+11.57min" },
        { time: "00:13:20", key: "p_feed_archive_user_prep End", message: "3 batches", sinceLast: "+1.20min", sinceStart: "+13.17min" },
        { time: "00:13:20", key: "p_feed_archive_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+13.17min" },
        ...rangeLogs("p_feed_archive_partial", [
          { range: "0-499", start: "00:13:20", end: "00:14:20", ss0: "+13.17min", gap: "+1.00min", ss1: "+14.17min" },
          { range: "500-999", start: "00:14:20", end: "00:15:20", ss0: "+14.17min", gap: "+1.00min", ss1: "+15.17min" },
          { range: "1000-1499", start: "00:15:20", end: "00:16:10", ss0: "+15.17min", gap: "+50s", ss1: "+16.07min" }
        ]),
        { time: "00:16:10", key: "p_feed_archive_partial End", message: "3 batches", sinceLast: "+2.50min", sinceStart: "+16.07min" },
        { time: "00:16:10", key: "p_feed_archive_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+16.07min" },
        { time: "00:18:22", key: "p_feed_archive_end End", message: "SP Call", sinceLast: "+2.12min", sinceStart: "+18.19min" },
        { time: "00:18:22", key: "FeedArchive", message: "End", sinceLast: "+18.19min", sinceStart: "+18.19min" },
        { time: "00:18:22", key: "FeedReceiverProcess", message: "Start", sinceLast: "+0s", sinceStart: "+18.19min" },
        { time: "00:18:22", key: "p_feed_score_calculation_v2 Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+18.19min" },
        { time: "00:24:50", key: "p_feed_score_calculation_v2 End", message: "3 batches", sinceLast: "+6.28min", sinceStart: "+24.47min" },
        { time: "00:24:50", key: "p_feed_score_calculation_partial Started", message: "3 batches", sinceLast: "+0s", sinceStart: "+24.47min" },
        ...rangeLogs("p_feed_score_calculation_partial", [
          { range: "0-499", start: "00:24:50", end: "00:25:28", ss0: "+24.47min", gap: "+38s", ss1: "+25.25min" },
          { range: "500-999", start: "00:25:28", end: "00:26:06", ss0: "+25.25min", gap: "+38s", ss1: "+26.03min" },
          { range: "1000-1499", start: "00:26:06", end: "00:26:43", ss0: "+26.03min", gap: "+37s", ss1: "+26.40min" }
        ]),
        { time: "00:26:43", key: "p_feed_score_calculation_partial End", message: "3 batches", sinceLast: "+1.53min", sinceStart: "+26.40min" },
        { time: "00:26:43", key: "p_feed_score_calculation_end Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+26.40min" },
        { time: "00:27:03", key: "p_feed_score_calculation_end End", message: "SP Call", sinceLast: "+20s", sinceStart: "+27.00min" },
        { time: "00:27:03", key: "FeedReceiverProcess", message: "End", sinceLast: "+8.41min", sinceStart: "+27.00min" },
        { time: "00:27:03", key: "WindowsFeedService", message: "Completed", sinceLast: "+0s", sinceStart: "+27.00min" }
      ]
    },
    {
      id: "daily-post-list-email",
      name: "Daily Post List Email",
      method: "DialyPostListEmail",
      category: "Reports & Email",
      cron: "0 6 * * *",
      schedule: "Daily at 6:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 06:00:02",
      nextRun: "2026-09-10 06:00:00",
      duration: "48s",
      summary: "P_DIALY_POST_LIST_SCHEDULAR → Excel → NotificationActivity.SendManaulReports",
      lastRuns: [
        { at: "2026-09-09 06:00:02", status: "Succeeded", duration: "48s", runId: "hf-82011" }
      ],
      steps: [
        { time: "06:00:02", key: "DialyPostListEmail", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "06:00:02", key: "P_DIALY_POST_LIST_SCHEDULAR Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "06:00:31", key: "P_DIALY_POST_LIST_SCHEDULAR End", message: "SP Call", sinceLast: "+29s", sinceStart: "+29s" },
        { time: "06:00:31", key: "DialyPostListEmail", message: "Generating report file", sinceLast: "+0s", sinceStart: "+29s" },
        { time: "06:00:40", key: "DialyPostListEmail", message: "Sending email", sinceLast: "+9s", sinceStart: "+38s" },
        { time: "06:00:50", key: "DialyPostListEmail", message: "Completed. Email queued for reports@openlinksfoundation.org.", sinceLast: "+10s", sinceStart: "+48s" }
      ]
    },
    {
      id: "credit-user-award-points",
      name: "Credit User Award Points",
      method: "RunCreditUserAwardPoints",
      category: "Scoring & Portfolio",
      cron: "0 3 5 * *",
      schedule: "5th of every month at 3:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-05 03:00:04",
      nextRun: "2026-10-05 03:00:00",
      duration: "6m 12s",
      summary: "Runs only when IST day is 5. Credits previous month via P_CREDIT_USER_AWARD_POINTS",
      lastRuns: [
        { at: "2026-09-05 03:00:04", status: "Succeeded", duration: "6m 12s", runId: "hf-69020" },
        { at: "2026-08-05 03:00:03", status: "Succeeded", duration: "5m 51s", runId: "hf-51200" }
      ],
      steps: [
        { time: "03:00:04", key: "RunCreditUserAwardPoints", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "03:00:04", key: "P_CREDIT_USER_AWARD_POINTS Started", message: "SP Call for 2026-08-01", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "03:06:16", key: "P_CREDIT_USER_AWARD_POINTS End", message: "SP Call", sinceLast: "+6.12min", sinceStart: "+6.12min" }
      ]
    },
    {
      id: "form-response-user-data",
      name: "Form Response User Data",
      method: "RunFormResponseUserData",
      category: "Scoring & Portfolio",
      cron: "0 4 * * *",
      schedule: "Daily at 4:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 04:00:03",
      nextRun: "2026-09-10 04:00:00",
      duration: "4m 18s",
      summary: "p_get_feed_forms (Feed DB) then p_form_response_user_data_schedular (Process)",
      lastRuns: [
        { at: "2026-09-09 04:00:03", status: "Succeeded", duration: "4m 18s", runId: "hf-81220" }
      ],
      steps: [
        { time: "04:00:03", key: "RunFormResponseUserData", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "04:00:03", key: "p_get_feed_forms Started", message: "SP Call for 2026-09-08", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "04:00:11", key: "p_get_feed_forms End", message: "SP Call — returned 14 rows", sinceLast: "+8s", sinceStart: "+8s" },
        { time: "04:00:11", key: "p_form_response_user_data_schedular Started", message: "SP Call for 2026-09-08", sinceLast: "+0s", sinceStart: "+8s" },
        { time: "04:04:21", key: "p_form_response_user_data_schedular End", message: "SP Call", sinceLast: "+4.10min", sinceStart: "+4.18min" }
      ]
    },
    {
      id: "utkrisht-report-update",
      name: "Utkrisht Weekly Report",
      method: "UtkrishtReportUpdateSchedularJob",
      category: "Reports & Email",
      cron: "0 7 * * 1",
      schedule: "Every Monday at 7:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-07 07:00:02",
      nextRun: "2026-09-14 07:00:00",
      duration: "2m 41s",
      summary: "Opens/closes class 10 & 12 weeks on Main; report insert on Process",
      lastRuns: [
        { at: "2026-09-07 07:00:02", status: "Succeeded", duration: "2m 41s", runId: "hf-73040" }
      ],
      steps: [
        { time: "07:00:02", key: "UtkrishtReportUpdateSchedularJob", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "07:00:03", key: "UtkrishtReportUpdateSchedularJob", message: "Flags close10=True, close12=False, open10=False, open12=True", sinceLast: "+1s", sinceStart: "+1s" },
        { time: "07:00:03", key: "p_utkrisht_weekly_scheduler_report_v1 Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+1s" },
        { time: "07:02:18", key: "p_utkrisht_weekly_scheduler_report_v1 End", message: "SP Call", sinceLast: "+2.15min", sinceStart: "+2.16min" },
        { time: "07:02:18", key: "UtkrishtReportUpdateSchedularJob", message: "Closing class 10 week on Main dbo", sinceLast: "+0s", sinceStart: "+2.16min" },
        { time: "07:02:33", key: "UtkrishtReportUpdateSchedularJob", message: "Opening class 12 week on Main dbo", sinceLast: "+15s", sinceStart: "+2.31min" },
        { time: "07:02:43", key: "UtkrishtReportUpdateSchedularJob", message: "Completed", sinceLast: "+10s", sinceStart: "+2.41min" }
      ]
    },
    {
      id: "attendance-leaderboard-student-teacher-insert",
      name: "Attendance Leaderboard Insert",
      method: "AttendanceLeaderboardStudentTeacherInsert",
      category: "Attendance",
      cron: "0 3 1 * *",
      schedule: "1st of every month at 3:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-01 03:00:04",
      nextRun: "2026-10-01 03:00:00",
      duration: "9m 20s",
      summary: "Reads student/teacher source from Process, inserts JSON into Main",
      lastRuns: [
        { at: "2026-09-01 03:00:04", status: "Succeeded", duration: "9m 20s", runId: "hf-61008" }
      ],
      steps: [
        { time: "03:00:04", key: "AttendanceLeaderboardStudentTeacherInsert Started", message: "p_attendence_month=2026-08-30", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "03:00:04", key: "f_leaderboard_attendence_student_source Processor Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "03:03:40", key: "f_leaderboard_attendence_student_source Processor End", message: "SP Call", sinceLast: "+3.36min", sinceStart: "+3.36min" },
        { time: "03:03:40", key: "f_leaderboard_attendence_student_source Row Count", message: "12840", sinceLast: "+0s", sinceStart: "+3.36min" },
        { time: "03:03:40", key: "p_leaderboard_attendence_insert_student_data Main Server Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+3.36min" },
        { time: "03:06:12", key: "p_leaderboard_attendence_insert_student_data Main Server End", message: "SP Call", sinceLast: "+2.32min", sinceStart: "+6.08min" },
        { time: "03:06:12", key: "f_leaderboard_attendence_teacher_source Processor Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+6.08min" },
        { time: "03:07:01", key: "f_leaderboard_attendence_teacher_source Processor End", message: "SP Call", sinceLast: "+49s", sinceStart: "+6.57min" },
        { time: "03:07:01", key: "f_leaderboard_attendence_teacher_source Row Count", message: "940", sinceLast: "+0s", sinceStart: "+6.57min" },
        { time: "03:07:01", key: "p_leaderboard_attendence_insert_teacher_data Main Server Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+6.57min" },
        { time: "03:09:24", key: "p_leaderboard_attendence_insert_teacher_data Main Server End", message: "SP Call", sinceLast: "+2.23min", sinceStart: "+9.20min" },
        { time: "03:09:24", key: "AttendanceLeaderboardStudentTeacherInsert Completed", message: "", sinceLast: "+0s", sinceStart: "+9.20min" }
      ]
    },
    {
      id: "link-crone-job",
      name: "Chapter Link Summary",
      method: "LinkCroneJob",
      category: "Content & Links",
      cron: "0 1 * * *",
      schedule: "Daily at 1:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 01:00:06",
      nextRun: "2026-09-10 01:00:00",
      duration: "11m 04s",
      summary: "p_summery_chapter_link_crone then p_summery_chapter_article (continues if first fails, then throws)",
      lastRuns: [{ at: "2026-09-09 01:00:06", status: "Succeeded", duration: "11m 04s", runId: "hf-79810" }],
      steps: [
        { time: "01:00:06", key: "LinkCroneJob", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "01:00:06", key: "p_summery_chapter_link_crone Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "01:07:20", key: "p_summery_chapter_link_crone End", message: "SP Call", sinceLast: "+7.14min", sinceStart: "+7.14min" },
        { time: "01:07:20", key: "p_summery_chapter_article Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+7.14min" },
        { time: "01:11:10", key: "p_summery_chapter_article End", message: "SP Call", sinceLast: "+3.50min", sinceStart: "+11.04min" }
      ]
    },
    {
      id: "summary-link-report",
      name: "Summary Link Report",
      method: "SummaryLinkReportCronJobs",
      category: "Content & Links",
      cron: "0 2 * * *",
      schedule: "Daily at 2:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 02:00:08",
      nextRun: "2026-09-10 02:00:00",
      duration: "6m 02s",
      summary: "p_summary_link_report",
      lastRuns: [{ at: "2026-09-09 02:00:08", status: "Succeeded", duration: "6m 02s", runId: "hf-80120" }],
      steps: simpleSp("SummaryLinkReportCronJobs", "p_summary_link_report", "02:00:08", "+6.02min")
    },
    {
      id: "daily-score",
      name: "Daily Score",
      method: "DailyScoreJob",
      category: "Scoring & Portfolio",
      cron: "0 3 * * *",
      schedule: "Daily at 3:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 03:00:02",
      nextRun: "2026-09-10 03:00:00",
      duration: "14m 33s",
      summary: "P_CALCULATE_DAILY_SCORE on portfolio",
      lastRuns: [{ at: "2026-09-09 03:00:02", status: "Succeeded", duration: "14m 33s", runId: "hf-80800" }],
      steps: simpleSp("DailyScoreJob", "P_CALCULATE_DAILY_SCORE", "03:00:02", "+14.33min")
    },
    {
      id: "chat-summary",
      name: "Chat Comment Summary",
      method: "ChatSummaryJob",
      category: "Content & Links",
      cron: "0 4 * * *",
      schedule: "Daily at 4:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 04:00:05",
      nextRun: "2026-09-10 04:00:00",
      duration: "2m 09s",
      summary: "p_calculate_comment_summery",
      lastRuns: [{ at: "2026-09-09 04:00:05", status: "Succeeded", duration: "2m 09s", runId: "hf-81222" }],
      steps: simpleSp("ChatSummaryJob", "p_calculate_comment_summery", "04:00:05", "+2.09min")
    },
    {
      id: "feed-db-synch",
      name: "Feed DB User Sync",
      method: "FeedDBSynchSchedularJob",
      category: "Data Sync",
      cron: "0 5 * * *",
      schedule: "Daily at 5:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 05:00:02",
      nextRun: "2026-09-10 05:00:00",
      duration: "3m 40s",
      summary: "p_update_user_details action_type=All on Main",
      lastRuns: [{ at: "2026-09-09 05:00:02", status: "Succeeded", duration: "3m 40s", runId: "hf-81600" }],
      steps: simpleSp("FeedDBSynchSchedularJob", "p_update_user_details", "05:00:02", "+3.40min")
    },
    {
      id: "refresh-morning-assembly",
      name: "Refresh Morning Assembly",
      method: "RunRefreshMorningAssembly",
      category: "Content & Links",
      cron: "0 5 * * *",
      schedule: "Daily at 5:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 05:00:04",
      nextRun: "2026-09-10 05:00:00",
      duration: "1m 22s",
      summary: "p_ep_refresh_morning_assembly_1 on Engagement DB",
      lastRuns: [{ at: "2026-09-09 05:00:04", status: "Succeeded", duration: "1m 22s", runId: "hf-81604" }],
      steps: simpleSp("RunRefreshMorningAssembly", "p_ep_refresh_morning_assembly_1", "05:00:04", "+1.22min")
    },
    {
      id: "pom-denormalized",
      name: "POM Denormalized",
      method: "RunPomDenormalized",
      category: "Scoring & Portfolio",
      cron: "0 7 * * *",
      schedule: "Daily at 7:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 07:00:03",
      nextRun: "2026-09-10 07:00:00",
      duration: "8m 55s",
      summary: "P_POM_DENORMALIZED on portfolio",
      lastRuns: [{ at: "2026-09-09 07:00:03", status: "Succeeded", duration: "8m 55s", runId: "hf-82400" }],
      steps: simpleSp("RunPomDenormalized", "P_POM_DENORMALIZED", "07:00:03", "+8.55min")
    },
    {
      id: "insert-library-links-v2",
      name: "Insert Library Links V2",
      method: "RunInsertLibraryLinksV2",
      category: "Content & Links",
      cron: "0 8 * * *",
      schedule: "Daily at 8:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 08:00:02",
      nextRun: "2026-09-10 08:00:00",
      duration: "4m 10s",
      summary: "P_INSERT_LIBRARY_LINKS_V2",
      lastRuns: [{ at: "2026-09-09 08:00:02", status: "Succeeded", duration: "4m 10s", runId: "hf-82810" }],
      steps: simpleSp("RunInsertLibraryLinksV2", "P_INSERT_LIBRARY_LINKS_V2", "08:00:02", "+4.10min")
    },
    {
      id: "user-coupon-mark-expired",
      name: "Expire User Coupons",
      method: "UserCouponMarkExpired",
      category: "User & Access",
      cron: "0 8 * * *",
      schedule: "Daily at 8:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 08:00:04",
      nextRun: "2026-09-10 08:00:00",
      duration: "6s",
      summary: "p_user_coupon_mark_expired on Main",
      lastRuns: [{ at: "2026-09-09 08:00:04", status: "Succeeded", duration: "6s", runId: "hf-82812" }],
      steps: simpleSp("UserCouponMarkExpired", "p_user_coupon_mark_expired", "08:00:04", "+6s")
    },
    {
      id: "unblock-users",
      name: "Unblock Users (Credibility)",
      method: "UnblockUsers",
      category: "User & Access",
      cron: "0 9 * * *",
      schedule: "Daily at 9:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 09:00:02",
      nextRun: "2026-09-10 09:00:00",
      duration: "11s",
      summary: "p_unblock_users_credibility_scheduler on Main",
      lastRuns: [{ at: "2026-09-09 09:00:02", status: "Succeeded", duration: "11s", runId: "hf-83200" }],
      steps: simpleSp("UnblockUsers", "p_unblock_users_credibility_scheduler", "09:00:02", "+11s")
    },
    {
      id: "morning-assembly-daily-email",
      name: "Morning Assembly Daily Visit Email",
      method: "MorningAssemblyVisitDailyEmail",
      category: "Reports & Email",
      cron: "0 6 * * *",
      schedule: "Daily at 6:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-09 06:00:06",
      nextRun: "2026-09-10 06:00:00",
      duration: "1m 04s",
      summary: "P_MORNING_ASSEMBALLY_SEARCH_VISIT_DATA → Excel (Daily + Previous Week)",
      lastRuns: [{ at: "2026-09-09 06:00:06", status: "Succeeded", duration: "1m 04s", runId: "hf-82020" }],
      steps: [
        { time: "06:00:06", key: "MorningAssemblyVisitDailyEmail", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "06:00:06", key: "dbo.P_MORNING_ASSEMBALLY_SEARCH_VISIT_DATA Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "06:00:48", key: "dbo.P_MORNING_ASSEMBALLY_SEARCH_VISIT_DATA End", message: "SP Call", sinceLast: "+42s", sinceStart: "+42s" },
        { time: "06:00:48", key: "MorningAssemblyVisitDailyEmail", message: "Generating report file", sinceLast: "+0s", sinceStart: "+42s" },
        { time: "06:00:55", key: "MorningAssemblyVisitDailyEmail", message: "Sending email", sinceLast: "+7s", sinceStart: "+49s" },
        { time: "06:01:10", key: "MorningAssemblyVisitDailyEmail", message: "Completed. Email queued for reports@openlinksfoundation.org.", sinceLast: "+15s", sinceStart: "+1.04min" }
      ]
    },
    {
      id: "weekly-post-list-email",
      name: "Weekly Post List Email",
      method: "WeeklyPostListEmail",
      category: "Reports & Email",
      cron: "0 7 * * 1",
      schedule: "Every Monday at 7:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-07 07:00:04",
      nextRun: "2026-09-14 07:00:00",
      duration: "1m 18s",
      summary: "P_WEEKLY_POST_LIST_SCHEDULAR for previous 7 days",
      lastRuns: [{ at: "2026-09-07 07:00:04", status: "Succeeded", duration: "1m 18s", runId: "hf-73044" }],
      steps: [
        { time: "07:00:04", key: "WeeklyPostListEmail", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "07:00:04", key: "P_WEEKLY_POST_LIST_SCHEDULAR Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "07:01:02", key: "P_WEEKLY_POST_LIST_SCHEDULAR End", message: "SP Call", sinceLast: "+58s", sinceStart: "+58s" },
        { time: "07:01:02", key: "WeeklyPostListEmail", message: "Generating report file", sinceLast: "+0s", sinceStart: "+58s" },
        { time: "07:01:10", key: "WeeklyPostListEmail", message: "Sending email", sinceLast: "+8s", sinceStart: "+1.06min" },
        { time: "07:01:22", key: "WeeklyPostListEmail", message: "Completed. Email queued for reports@openlinksfoundation.org.", sinceLast: "+12s", sinceStart: "+1.18min" }
      ]
    },
    {
      id: "morning-assembly-weekly-email",
      name: "Morning Assembly Weekly Visit Email",
      method: "MorningAssemblyVisitWeeklyEmail",
      category: "Reports & Email",
      cron: "0 7 * * 1",
      schedule: "Every Monday at 7:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-07 07:00:08",
      nextRun: "2026-09-14 07:00:00",
      duration: "52s",
      summary: "P_MORNING_ASSEMBALLY_SEARCH_VISIT_WEEKLY_REPORT",
      lastRuns: [{ at: "2026-09-07 07:00:08", status: "Succeeded", duration: "52s", runId: "hf-73050" }],
      steps: [
        { time: "07:00:08", key: "MorningAssemblyVisitWeeklyEmail", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "07:00:08", key: "P_MORNING_ASSEMBALLY_SEARCH_VISIT_WEEKLY_REPORT Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "07:00:44", key: "P_MORNING_ASSEMBALLY_SEARCH_VISIT_WEEKLY_REPORT End", message: "SP Call", sinceLast: "+36s", sinceStart: "+36s" },
        { time: "07:00:44", key: "MorningAssemblyVisitWeeklyEmail", message: "Generating report file", sinceLast: "+0s", sinceStart: "+36s" },
        { time: "07:00:50", key: "MorningAssemblyVisitWeeklyEmail", message: "Sending email", sinceLast: "+6s", sinceStart: "+42s" },
        { time: "07:01:00", key: "MorningAssemblyVisitWeeklyEmail", message: "Completed. Email queued for reports@openlinksfoundation.org.", sinceLast: "+10s", sinceStart: "+52s" }
      ]
    },
    {
      id: "sadhan-vyakti-report",
      name: "Sadhan Vyakti Summary Email",
      method: "SadhanVyaktichedularJob",
      category: "Reports & Email",
      cron: "0 8 * * 1",
      schedule: "Every Monday at 8:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-07 08:00:03",
      nextRun: "2026-09-14 08:00:00",
      duration: "41s",
      summary: "p_report_sadhan_vyakti_schedular → email list from SadhanVyaktiReportEmailIds",
      lastRuns: [{ at: "2026-09-07 08:00:03", status: "Succeeded", duration: "41s", runId: "hf-73400" }],
      steps: [
        { time: "08:00:03", key: "SadhanVyaktichedularJob", message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "08:00:03", key: "p_report_sadhan_vyakti_schedular Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "08:00:28", key: "p_report_sadhan_vyakti_schedular End", message: "SP Call", sinceLast: "+25s", sinceStart: "+25s" },
        { time: "08:00:28", key: "SadhanVyaktichedularJob", message: "Generating report file", sinceLast: "+0s", sinceStart: "+25s" },
        { time: "08:00:34", key: "SadhanVyaktichedularJob", message: "Sending email", sinceLast: "+6s", sinceStart: "+31s" },
        { time: "08:00:44", key: "SadhanVyaktichedularJob", message: "Completed. Email queued for omkar@openlinksfoundation.org,ranjit@zestorm.com,vishvajitolf@gmail.com.", sinceLast: "+10s", sinceStart: "+41s" }
      ]
    },
    {
      id: "user-monthly-consistency-insert",
      name: "User Monthly Consistency",
      method: "RunUserMonthlyConsistencyInsert",
      category: "Scoring & Portfolio",
      cron: "0 6 1 * *",
      schedule: "1st of every month at 6:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-01 06:00:02",
      nextRun: "2026-10-01 06:00:00",
      duration: "22m 10s",
      summary: "P_USER_MONTHLY_CONSISTENCY_INSERT",
      lastRuns: [{ at: "2026-09-01 06:00:02", status: "Succeeded", duration: "22m 10s", runId: "hf-61800" }],
      steps: simpleSp("RunUserMonthlyConsistencyInsert", "P_USER_MONTHLY_CONSISTENCY_INSERT", "06:00:02", "+22.10min")
    },
    {
      id: "weekly-notification",
      name: "Weekly Notification",
      method: "WeeklyNotificationJob",
      category: "Notifications",
      cron: "0 8 * * 1",
      schedule: "Every Monday at 8:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-09-07 08:00:06",
      nextRun: "2026-09-14 08:00:00",
      duration: "3m 05s",
      summary: "Broadcast weekly notifications (Phase 4 — no Hangfire step log today)",
      lastRuns: [{ at: "2026-09-07 08:00:06", status: "Succeeded", duration: "3m 05s", runId: "hf-73410" }],
      steps: [
        { time: "08:00:06", key: "WeeklyNotificationJob", message: "Started (file log only — this job does not use HangfireJobStepLog)", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "08:03:11", key: "WeeklyNotificationJob", message: "Completed", sinceLast: "+3.05min", sinceStart: "+3.05min" }
      ]
    },
    {
      id: "monthly-notification",
      name: "Monthly Notification",
      method: "MonthlyNotificationJob",
      category: "Notifications",
      cron: "0 8 1 * *",
      schedule: "1st of every month at 8:00 AM IST",
      enabled: false,
      lastStatus: "Disabled",
      lastRun: "—",
      nextRun: "—",
      duration: "—",
      summary: "Paused in Hangfire job config",
      lastRuns: [],
      steps: []
    },
    {
      id: "yearly-notification",
      name: "Yearly Notification",
      method: "YearlyNotificationJob",
      category: "Notifications",
      cron: "0 0 1 1 *",
      schedule: "1 January at 12:00 AM IST",
      enabled: true,
      lastStatus: "Succeeded",
      lastRun: "2026-01-01 00:00:08",
      nextRun: "2027-01-01 00:00:00",
      duration: "1m 40s",
      summary: "Broadcast yearly notifications (Phase 4)",
      lastRuns: [{ at: "2026-01-01 00:00:08", status: "Succeeded", duration: "1m 40s", runId: "hf-12001" }],
      steps: [
        { time: "00:00:08", key: "YearlyNotificationJob", message: "Started (file log only — this job does not use HangfireJobStepLog)", sinceLast: "+0s", sinceStart: "+0s" },
        { time: "00:01:48", key: "YearlyNotificationJob", message: "Completed", sinceLast: "+1.40min", sinceStart: "+1.40min" }
      ]
    }
  ],

  userQueue: buildUserQueue()
};

function buildUserQueue() {
  const names = ["rahul.patil", "sneha.kale", "anita.deshmukh", "amit.joshi", "priya.shinde", "karan.mehta", "neha.gokhale", "vikram.naik"];
  const days = ["2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06", "2026-09-07", "2026-09-08", "2026-09-09"];
  const rows = [];
  let jobId = 9800;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function clock(hour, minute, second) {
    return pad(hour) + ":" + pad(minute) + ":" + pad(second || 0);
  }

  function push(row) {
    rows.push(row);
  }

  days.forEach((date, dayIndex) => {
    const isToday = date === "2026-09-09";
    const portfolioCount = 5 + (dayIndex % 3);
    const updateCount = 3 + (dayIndex % 3);
    const viewsCount = 6 + (dayIndex % 4);

    const ticks = [[8, 0], [12, 0], [16, 0], [16, 30]];

    function pollerClock(i, second) {
      const [hour, minute] = ticks[i % ticks.length];
      return clock(hour, minute, second);
    }

    for (let i = 0; i < portfolioCount; i++) {
      jobId += 1;
      const created = date + " " + clock(8, 12 + i * 7);
      const started = date + " " + pollerClock(i, 1 + i);
      const ended = date + " " + pollerClock(i, 28 + i);
      const fail = !isToday && dayIndex === 2 && i === 0;
      push({
        jobId,
        jobCode: "P_PORTFOLIO_USER_DETAILS_DEFAULT_SCHEDULER",
        param: { USER_ID: 77000 + dayIndex * 40 + i, USER_NAME: names[i % names.length], SCHOOL_ID: 300 + ((dayIndex + i) % 18) },
        status: fail ? "Failed" : "Success",
        createdAt: created,
        startedAt: started,
        endedAt: fail ? date + " " + pollerClock(i, 19) : ended,
        attemptCount: fail ? 2 : 1,
        failureReason: fail ? "57014: canceling statement due to statement timeout" : null
      });
    }

    for (let i = 0; i < updateCount; i++) {
      jobId += 1;
      const created = date + " " + clock(9, 4 + i * 11);
      const started = date + " " + pollerClock(i + 1, 4 + i);
      const ended = date + " " + pollerClock(i + 1, 22 + i);
      const fail = !isToday && (dayIndex === 5 && i === 1);
      push({
        jobId,
        jobCode: "p_portfolio_details_schedular_update",
        param: { USER_ID: 55000 + dayIndex * 30 + i },
        status: fail ? "Failed" : "Success",
        createdAt: created,
        startedAt: started,
        endedAt: fail ? date + " " + pollerClock(i + 1, 14) : ended,
        attemptCount: fail ? 2 : 1,
        failureReason: fail ? "42703: relation portfolio.p_portfolio_details_schedular_update lock timeout" : null
      });
    }

    for (let i = 0; i < viewsCount; i++) {
      jobId += 1;
      const created = date + " " + clock(10, i * 5, 20);
      const started = date + " " + pollerClock(i + 2, 2 + i);
      const ended = date + " " + pollerClock(i + 2, 8 + i);
      push({
        jobId,
        jobCode: "UPDATE_AI_LINK_METRICS_VIEWS_COUNT",
        param: { LINK_ID: 710000 + dayIndex * 80 + i, increment: 1 + (i % 6) },
        status: "Success",
        createdAt: created,
        startedAt: started,
        endedAt: ended,
        attemptCount: 1,
        failureReason: null
      });
    }
  });

  const today = rows.filter((row) => row.createdAt.startsWith("2026-09-09") && row.jobCode === "P_PORTFOLIO_USER_DETAILS_DEFAULT_SCHEDULER");
  today.slice(0, 2).forEach((row, i) => {
    row.status = "Pending";
    row.startedAt = null;
    row.endedAt = null;
    row.attemptCount = 0;
    row.failureReason = null;
    row.createdAt = "2026-09-09 " + clock(16, 40 + i * 4, 12);
  });

  const todayUpdate = rows.find((row) => row.createdAt.startsWith("2026-09-09") && row.jobCode === "p_portfolio_details_schedular_update");
  if (todayUpdate) {
    todayUpdate.status = "Processing";
    todayUpdate.startedAt = "2026-09-09 16:30:50";
    todayUpdate.endedAt = null;
    todayUpdate.attemptCount = 1;
    todayUpdate.failureReason = null;
  }

  const todayViews = rows.filter((row) => row.createdAt.startsWith("2026-09-09") && row.jobCode === "UPDATE_AI_LINK_METRICS_VIEWS_COUNT");
  todayViews.slice(0, 2).forEach((row, i) => {
    row.status = "Pending";
    row.startedAt = null;
    row.endedAt = null;
    row.attemptCount = 0;
    row.createdAt = "2026-09-09 " + clock(16, 48 + i, 0);
  });

  const todayFail = rows.find((row) => row.createdAt.startsWith("2026-09-09") && row.jobCode === "p_portfolio_details_schedular_update" && row !== todayUpdate);
  if (todayFail) {
    todayFail.status = "Failed";
    todayFail.startedAt = "2026-09-09 16:00:08";
    todayFail.endedAt = "2026-09-09 16:00:19";
    todayFail.attemptCount = 2;
    todayFail.failureReason = "42703: relation portfolio.p_portfolio_details_schedular_update lock timeout";
  }

  return rows.sort((a, b) => b.jobId - a.jobId);
}

function rangeLogs(spName, batches) {
  const rows = [];
  batches.forEach((b) => {
    rows.push({ time: b.start, key: spName + " Started range " + b.range, message: "", sinceLast: "+0s", sinceStart: b.ss0 });
    rows.push({ time: b.end, key: spName + " End range " + b.range, message: "", sinceLast: b.gap, sinceStart: b.ss1 });
  });
  return rows;
}

function simpleSp(jobName, spName, startTime, duration) {
  const endClock = addClock(startTime, duration);
  return [
    { time: startTime, key: jobName, message: "Started", sinceLast: "+0s", sinceStart: "+0s" },
    { time: startTime, key: spName + " Started", message: "SP Call", sinceLast: "+0s", sinceStart: "+0s" },
    { time: endClock, key: spName + " End", message: "SP Call", sinceLast: duration, sinceStart: duration }
  ];
}

function addClock(hhmmss, gap) {
  const [h, m, s] = hhmmss.split(":").map(Number);
  let total = h * 3600 + m * 60 + s;
  if (gap.endsWith("min")) {
    const n = gap.replace("+", "").replace("min", "");
    const [mm, ss] = n.split(".");
    total += Number(mm) * 60 + Number((ss || "0").padEnd(2, "0").slice(0, 2));
  } else {
    total += Number(gap.replace("+", "").replace("s", ""));
  }
  const hh = String(Math.floor(total / 3600) % 24).padStart(2, "0");
  const mi = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const se = String(total % 60).padStart(2, "0");
  return hh + ":" + mi + ":" + se;
}
