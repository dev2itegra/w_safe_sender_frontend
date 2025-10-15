export function calculateDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return { hours, minutes, seconds };
}


export function formatDuration({ hours, minutes, seconds, includeZeroHours = false }) {
    const pad = (value) => value.toString().padStart(2, "0");

    if (hours > 0 || includeZeroHours) {
        return `${pad(Math.ceil(hours))}:${pad(Math.ceil(minutes))}:${pad(Math.ceil(seconds))}`;
    }

    return `${pad(Math.ceil(minutes))}:${pad(Math.ceil(seconds))}`;
}


export function formatDurationTime(hours, minutes, seconds) {
    const parts = [];

    if (hours > 0) {
        parts.push(pluralizeRu(hours, ["час", "часа", "часов"]));
    }
    if (minutes > 0) {
        parts.push(pluralizeRu(minutes, ["минута", "минуты", "минут"]));
    }
    if (seconds > 0 || parts.length === 0) {
        parts.push(pluralizeRu(seconds, ["секунда", "секунды", "секунд"]));
    }

    return parts.join(" ");
}


export function pluralizeRu(number, forms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return `${number} ${forms[2]}`;
    if (n1 > 1 && n1 < 5) return `${number} ${forms[1]}`;
    if (n1 === 1) return `${number} ${forms[0]}`;
    return `${number} ${forms[2]}`;
}
