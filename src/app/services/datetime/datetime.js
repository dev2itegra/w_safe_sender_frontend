function normalizeTimeZone(raw) {
    if (!raw) return null;
    if (typeof raw !== "string") raw = String(raw);

    if (raw.includes("/")) return raw;

    const m = raw.match(/^ ?(?:UTC)?\s*([+-]\d{1,2})(?::?(\d{2}))?$/i);
    if (m) {
        const h = parseInt(m[1], 10);
        const mm = m[2] ? parseInt(m[2], 10) : 0;
        if (mm === 0) {
            const sign = h > 0 ? "-" : "+";
            return `Etc/GMT${sign}${Math.abs(h)}`;
        }
        return h * 60 + (h >= 0 ? mm : -mm);
    }

    if (/^MSK$/i.test(raw)) return "Europe/Moscow";

    return null;
}

function getAccountTimeZone() {
    const acc = APP?.constant?.("account") || {};
    const raw = acc.timezone || acc.offset || "Europe/Moscow";
    const norm = normalizeTimeZone(raw);
    return norm ?? "Europe/Moscow";
}

export function formatDateTimeDisplay(
    input,
    { locale = "ru-RU", withSeconds = false } = {}
) {
    const d =
        input instanceof Date
            ? input
            : typeof input === "number"
            ? new Date(input < 1e12 ? input * 1000 : input)
            : new Date(input);

    if (isNaN(d)) return "";

    const tz = getAccountTimeZone();

    if (typeof tz === "string") {
        const opts = {
            timeZone: tz,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(withSeconds ? { second: "2-digit" } : {}),
        };
        return new Intl.DateTimeFormat(locale, opts).format(d).replace(",", "");
    }

    if (typeof tz === "number") {
        const shifted = new Date(d.getTime() + tz * 60 * 1000);
        const opts = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(withSeconds ? { second: "2-digit" } : {}),
        };
        return new Intl.DateTimeFormat(locale, opts).format(shifted).replace(",", "");
    }

    return d.toLocaleString(locale).replace(",", "");
}
