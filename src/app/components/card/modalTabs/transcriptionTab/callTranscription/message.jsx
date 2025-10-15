import React, { useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { calculateDuration, formatDuration } from "../../../durationCalculating";

export function Message({
    text,
    timing,
    senderName,
    imageText,
    senderRepeatition = false,
    onClick = undefined,
    isManager = false,
    highlights = [],
    messageGlobalOffset = 0,
    activeGlobalIndex = -1,
    registerMark, 
}) {
    const rootRef = useRef(null);

    const parts = useMemo(() => {
        const src = String(text ?? "");
        if (!highlights.length) return [{ t: src, mark: false, gidx: -1 }];

        const out = [];
        let last = 0;
        highlights.forEach(([s, e], i) => {
            if (s > last) out.push({ t: src.slice(last, s), mark: false, gidx: -1 });
            out.push({ t: src.slice(s, e), mark: true, gidx: messageGlobalOffset + i });
            last = e;
        });
        if (last < src.length) out.push({ t: src.slice(last), mark: false, gidx: -1 });
        return out;
    }, [text, highlights, messageGlobalOffset]);

    return (
        <Box
            ref={rootRef}
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                maxWidth: "60%",
                boxSizing: "border-box",
                marginTop: senderRepeatition ? "0" : "0.25rem",
                cursor: "pointer",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "var(--palette-background-default)",
                    borderRadius: "0.5rem",
                    marginLeft: "0.5rem",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {senderRepeatition ? null : (
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--base_button_active)" }}>
                        {senderName}
                    </Typography>
                )}

                <Typography sx={{ fontSize: "0.8125rem", lineHeight: 1.45 }}>
                    {parts.map((p, i) =>
                        p.mark ? (
                            <mark
                                key={i}
                                data-gidx={p.gidx}
                                ref={(el) => registerMark?.(p.gidx, el)}
                                style={{
                                    padding: "0 0.1rem",
                                    background: p.gidx === activeGlobalIndex
                                        ? "var(--base_button_active)"
                                        : "rgba(255, 224, 0, 0.35)",
                                    color: p.gidx === activeGlobalIndex ? "#fff" : "inherit",
                                    borderRadius: "0.15rem",
                                }}
                            >
                                {p.t}
                            </mark>
                        ) : (
                            <span key={i}>{p.t}</span>
                        )
                    )}
                </Typography>

                <Typography sx={{ fontSize: "0.7rem", color: "var(--palette-text-secondary-dark-green)", marginLeft: "auto" }}>
                    {`${formatDuration(calculateDuration(timing.from))}`}
                </Typography>
            </Box>
        </Box>
    );
}
