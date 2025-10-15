export function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findMatches(text, query) {
    if (!query) return [];
    const source = String(text ?? "");
    const rx = new RegExp(escapeRegExp(query), "giu");
    const out = [];
    let m;
    while ((m = rx.exec(source)) !== null) {
        out.push([m.index, m.index + m[0].length]);
        if (m.index === rx.lastIndex) rx.lastIndex++;
    }
    return out;
}
