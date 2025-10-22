import {
    Box,
    Typography,
    TextField,
    Checkbox,
    IconButton,
} from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';

export default function AllowedTiming({ value, onChange }) {
    const DEFAULT_DAYS = [
        { id: 1, name: "Пн", enabled: false, from: "08:00", to: "22:00" },
        { id: 2, name: "Вт", enabled: false, from: "08:00", to: "22:00" },
        { id: 3, name: "Ср", enabled: false, from: "08:00", to: "22:00" },
        { id: 4, name: "Чт", enabled: false, from: "08:00", to: "22:00" },
        { id: 5, name: "Пт", enabled: false, from: "08:00", to: "22:00" },
        { id: 6, name: "Сб", enabled: false, from: "10:00", to: "20:00" },
        { id: 7, name: "Вс", enabled: false, from: "10:00", to: "20:00" },
    ];

    const [days, setDays] = useState(() => (value ?? DEFAULT_DAYS));

    useEffect(() => {
        if (value !== undefined) setDays(value);
    }, [value]);

    const setDaysBoth = useCallback((updater) => {
        setDays(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (onChange) onChange(next);
            return next;
        });
    }, [onChange]);

    const onCheckDay = useCallback((index, checked) => {
        setDaysBoth(prev => prev.map((d, i) => (i === index ? { ...d, enabled: checked } : d)));
    }, [setDaysBoth]);

    const onChangeTime = useCallback((index, field, val) => {
        setDaysBoth(prev => prev.map((d, i) => (i === index ? { ...d, [field]: val } : d)));
    }, [setDaysBoth]);

    const onApplyToAll = useCallback((from, to) => {
        setDaysBoth(prev => prev.map(d => ({ ...d, enabled: true, from, to })));
    }, [setDaysBoth]);

    return (
        <Box sx={{ boxSizing: "border-box", display: "flex", width: "100%", height: "100%" }}>
            <Box sx={{ width: "100%", position: "relative", height: "100%", minHeight: 0 }}>
                <Typography
                    variant="caption"
                    sx={{
                        position: "absolute",
                        top: "-9px",
                        left: "10px",
                        px: "6px",
                        background: "var(--palette-background-primary)",
                        color: "var(--palette-text-secondary, var(--palette-border-default))",
                        fontSize: "0.75rem",
                        lineHeight: 1,
                        zIndex: 1,
                    }}
                >
                    Разрешённое время отправки
                </Typography>

                <WeekDays
                    days={days}
                    onCheckDay={onCheckDay}
                    onChangeTime={onChangeTime}
                    onApplyToAll={onApplyToAll}
                />
            </Box>
        </Box>
    );
}

function WeekDays({ days, onCheckDay, onChangeTime, onApplyToAll }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "6px",
                p: "12px 6px",
                border: "1px solid var(--palette-border-default)",
                borderRadius: "6px",
                background: "var(--palette-background-primary)",
                height: "100%",
                overflowY: "auto",
            }}
        >
            {days.map((d, i) => (
                <Day
                    key={i}
                    index={i}
                    name={d.name}
                    enabled={d.enabled}
                    from={d.from}
                    to={d.to}
                    onCheckDay={onCheckDay}
                    onChangeTime={onChangeTime}
                    onApplyToAll={onApplyToAll}
                />
            ))}
        </Box>
    );
}

function Day({ index, name, enabled, from, to, onCheckDay, onChangeTime, onApplyToAll }) {
    // helpers
    const toMinutes = (t) => {
        const [hh = "00", mm = "00"] = (t || "00:00").split(":");
        return parseInt(hh, 10) * 60 + parseInt(mm, 10);
    };
    const fmt = (mins) => {
        const v = Math.max(0, Math.min(mins, 23 * 60 + 59));
        const H = String(Math.floor(v / 60)).padStart(2, "0");
        const M = String(v % 60).padStart(2, "0");
        return `${H}:${M}`;
    };

    const handleFromBlur = (normalizedFrom) => {
        const fromM = toMinutes(normalizedFrom);
        const toM = toMinutes(to);
        if (toM <= fromM) {
            const fixed = fmt(fromM + 60); // +1 час, без перехода суток
            onChangeTime(index, "to", fixed);
        }
    };

    const handleToBlur = (normalizedTo) => {
        const fromM = toMinutes(from);
        const toM = toMinutes(normalizedTo);
        if (toM <= fromM) {
            const fixed = fmt(fromM + 60);
            onChangeTime(index, "to", fixed);
        }
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: enabled ? "64px 1fr 1rem 1fr 36px" : "64px 1fr",
                alignItems: "center",
                gap: "6px",
                p: "2px 6px",
                borderRadius: "6px",
                background: "transparent",
                position: "relative",
                "&:hover": {
                    background: "rgba(255,255,255,0.03)",
                    "& .apply-btn": {
                        opacity: enabled ? 1 : 0,
                        visibility: enabled ? "visible" : "hidden",
                    },
                },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Checkbox
                    checked={enabled}
                    onChange={(e) => onCheckDay(index, e.target.checked)}
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-checked": { color: "var(--button_blue)" },
                        p: 0.25,
                    }}
                />
                <Typography
                    sx={{
                        color: "var(--palette-text-primary)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        minWidth: "24px",
                    }}
                >
                    {name}
                </Typography>
            </Box>

            {enabled && (
                <>
                    <TimeInput
                        value={from}
                        disabled={!enabled}
                        onChange={(v) => onChangeTime(index, "from", v)}
                        onNormalized={handleFromBlur}
                    />

                    <Typography sx={{ color: "var(--palette-border-default)", textAlign: "center" }}>
                        —
                    </Typography>

                    <TimeInput
                        value={to}
                        disabled={!enabled}
                        onChange={(v) => onChangeTime(index, "to", v)}
                        onNormalized={handleToBlur}
                    />

                    <IconButton
                        className="apply-btn"
                        size="small"
                        onClick={() => onApplyToAll(from, to)}
                        sx={{
                            color: "var(--button_blue)",
                            p: "2px",
                            opacity: 0,
                            visibility: "hidden",
                            transition: "opacity 0.2s ease, visibility 0.2s ease",
                        }}
                        title="Применить ко всем"
                    >
                        <DoneAllOutlinedIcon fontSize="small" />
                    </IconButton>
                </>
            )}
        </Box>
    );
}




function TimeInput({ value, disabled, onChange, onNormalized }) {
    const [hours, minutes] = (value || "00:00").split(":");
    const [h, setH] = React.useState(hours);
    const [m, setM] = React.useState(minutes);

    React.useEffect(() => {
        const [hh, mm] = (value || "00:00").split(":");
        setH(hh);
        setM(mm);
    }, [value]);

    const normalize = (txt, max) => {
        const d = (txt.match(/\d+/g) || []).join("").slice(0, 2);
        if (!d) return "00";
        const n = Math.min(max, parseInt(d, 10));
        return String(isNaN(n) ? 0 : n).padStart(2, "0");
    };

    const doBlurNormalize = () => {
        const nh = normalize(h, 23);
        const nm = normalize(m, 59);
        if (nh !== h) setH(nh);
        if (nm !== m) setM(nm);
        const val = `${nh}:${nm}`;
        onChange(val);
        if (typeof onNormalized === "function") onNormalized(val);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <TextField
                value={h}
                onChange={(e) => setH(e.target.value)}
                onBlur={doBlurNormalize}
                disabled={disabled}
                variant="standard"
                inputProps={{
                    maxLength: 2,
                    inputMode: "text",
                    style: {
                        textAlign: "center",
                        width: "30px",
                        color: disabled
                            ? "var(--palette-border-default)"
                            : "var(--palette-text-primary)",
                    },
                }}
                sx={{
                    "& .MuiInputBase-input": { p: 0, fontSize: "0.9rem" },
                    "& .MuiInputBase-root.Mui-disabled": { opacity: 1 },
                    "& .MuiInputBase-input.Mui-disabled": {
                        color: "var(--palette-border-default) !important",
                        WebkitTextFillColor: "var(--palette-border-default) !important",
                    },
                    "& .MuiInput-underline:before": { borderBottom: "none !important" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none !important" },
                    "& .MuiInput-underline:after": { borderBottom: "none !important" },
                }}
            />

            <Typography
                sx={{
                    color: "var(--palette-border-default)"
                }}
            >
                :
            </Typography>

            <TextField
                value={m}
                onChange={(e) => setM(e.target.value)}
                onBlur={doBlurNormalize}
                disabled={disabled}
                variant="standard"
                inputProps={{
                    maxLength: 2,
                    inputMode: "text",
                    style: {
                        textAlign: "center",
                        width: "30px",
                        color: disabled
                            ? "var(--palette-border-default)"
                            : "var(--palette-text-primary)",
                    },
                }}
                sx={{
                    "& .MuiInputBase-input": { p: 0, fontSize: "0.9rem" },
                    "& .MuiInputBase-root.Mui-disabled": { opacity: 1 },
                    "& .MuiInputBase-input.Mui-disabled": {
                        color: "var(--palette-border-default) !important",
                        WebkitTextFillColor: "var(--palette-border-default) !important",
                    },
                    "& .MuiInput-underline:before": { borderBottom: "none !important" },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none !important" },
                    "& .MuiInput-underline:after": { borderBottom: "none !important" },
                }}
            />
        </Box>
    );
}





