window.DateFmt = (function () {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function parse(value) {
    if (!value || value === "—") return null;
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!m) return null;
    return { y: m[1], mo: Number(m[2]), d: m[3], h: m[4], mi: m[5], s: m[6] };
  }

  function dateHead(p) {
    return `${p.d}-${MONTHS[p.mo - 1]}-${p.y}`;
  }

  function date(value) {
    const p = parse(value);
    if (!p) return value || "—";
    return dateHead(p);
  }

  function dateTime(value, options) {
    if (!value || value === "—") return "—";
    const p = parse(value);
    if (!p) return value;
    const head = dateHead(p);
    if (!p.h) return head;
    const time = options && options.seconds === false
      ? `${p.h}:${p.mi}`
      : `${p.h}:${p.mi}:${p.s || "00"}`;
    return `${head} ${time}`;
  }

  function dayMonth(value) {
    const p = parse(value);
    if (!p) return value || "—";
    return `${p.d}-${MONTHS[p.mo - 1]}`;
  }

  function inText(value) {
    if (value == null || value === "") return value;
    return String(value).replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (_, y, mo, d) => `${d}-${MONTHS[Number(mo) - 1]}-${y}`);
  }

  return { date, dateTime, dayMonth, inText };
})();
