import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./transcription.module.scss";

export function Searcher({
    value,
    onChange,
    total = 0,
    activeIndex = 0,
    onPrev,
    onNext,
    onClear,
}) {
    const [local, setLocal] = useState(value || "");

    useEffect(() => { setLocal(value || ""); }, [value]);

    useEffect(() => {
        if (local === (value || "")) return;
        const t = setTimeout(() => onChange?.(local), 220);
        return () => clearTimeout(t);
    }, [local, value, onChange]);

    const onKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            if (e.shiftKey) onPrev?.(); else onNext?.();
        } else if (e.key === "Escape") {
            setLocal("");
            onClear?.();
        }
    }, [onPrev, onNext, onClear]);

    return (
        <div
            style={{
                padding: "0.5rem",
                boxSizing: "border-box",
                width: "24rem",
                flexShrink: 0,
            }}
        >
            <Box sx={{
                width: "100%",
                height: "2.5rem",
                padding: "0.25rem 0.5rem",
                boxSizing: "border-box",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                border: "1px solid var(--palette-border-default)",
                borderRadius: "0.25rem",
                background: "var(--palette-background-primary)",
            }}>
                <input
                    type="text"
                    name="transcriptionTextSearch"
                    placeholder="Поиск"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    onKeyDown={onKeyDown}
                    className={clsx(styles.searcher)}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <Typography sx={{ fontSize: "0.75rem", color: "var(--palette-text-secondary-dark-green)", whiteSpace: "nowrap" }}>
                    {total ? `${activeIndex + 1}/${total}` : "0/0"}
                </Typography>
                <Tooltip title="Предыдущее (Shift+Enter)">
                    <IconButton size="small" onClick={onPrev} aria-label="prev"><span style={{lineHeight: 1, marginBottom: "2px", color: "var(--palette-text-secondary-dark-green)"}}>‹</span></IconButton>
                </Tooltip>
                <Tooltip title="Следующее (Enter)">
                    <IconButton size="small" onClick={onNext} aria-label="next"><span style={{lineHeight: 1, marginBottom: "2px", color: "var(--palette-text-secondary-dark-green)"}}>›</span></IconButton>
                </Tooltip>
                <Tooltip title="Очистить (Esc)">
                    <IconButton size="small" onClick={() => { setLocal(""); onClear?.(); }} aria-label="clear"><span style={{lineHeight: 1, color: "var(--palette-text-secondary-dark-green)"}}>×</span></IconButton>
                </Tooltip>
            </Box>
        </div>
    );
}
