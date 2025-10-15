import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography } from "@mui/material";

export function Duration({ value, onChange, delay = 300 }) {
    const toParts = (totalSec) => {
        const m = Math.floor((Number.isFinite(totalSec) ? totalSec : 0) / 60);
        const s = (Number.isFinite(totalSec) ? totalSec : 0) % 60;
        return [String(m), String(s).padStart(2, "0")];
    };

    const [fromMin, fromSecInit] = toParts(value.from);
    const [toMin, toSecInit] = toParts(value.to);

    const [fromMinutes, setFromMinutes] = useState(fromMin);
    const [fromSeconds, setFromSeconds] = useState(fromSecInit);
    const [toMinutes, setToMinutes] = useState(toMin);
    const [toSeconds, setToSeconds] = useState(toSecInit);

    useEffect(() => {
        const [m, s] = toParts(value.from);
        setFromMinutes(m);
        setFromSeconds(s);
        const [m2, s2] = toParts(value.to);
        setToMinutes(m2);
        setToSeconds(s2);
    }, [value.from, value.to]);

    const {
        a,
        b,
        errorFrom,
        errorTo,
        crossError,
        helperFrom,
        helperTo,
    } = useMemo(() => {
        const a = pairToSeconds(fromMinutes, fromSeconds);
        const b = pairToSeconds(toMinutes, toSeconds);

        const invalidFrom = !isValidMinutes(fromMinutes) || !isValidSeconds(fromSeconds);
        const invalidTo = !isValidMinutes(toMinutes) || !isValidSeconds(toSeconds);
        const crossError = a != null && b != null && a > b;

        return {
            a,
            b,
            errorFrom: invalidFrom || crossError,
            errorTo: invalidTo || crossError,
            crossError,
            helperFrom: invalidFrom ? "Введите минуты и секунды (сек 0–59)" : crossError ? "Начало > конца" : " ",
            helperTo: invalidTo ? "Введите минуты и секунды (сек 0–59)" : crossError ? "Конец < начала" : " ",
        };
    }, [fromMinutes, fromSeconds, toMinutes, toSeconds]);

    useEffect(() => {
        if (!onChange) return;
        if (a == null || b == null) return;
        if (crossError) return;

        const timer = setTimeout(() => {
            if (a !== value.from || b !== value.to) {
                onChange({ from: a, to: b });
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [a, b, crossError, onChange, value.from, value.to, delay]);

    const handleFromMinutes = useCallback((v) => setFromMinutes(maskMinutes(v)), []);
    const handleFromSeconds = useCallback((v) => setFromSeconds(maskSeconds(v)), []);
    const handleToMinutes = useCallback((v) => setToMinutes(maskMinutes(v)), []);
    const handleToSeconds = useCallback((v) => setToSeconds(maskSeconds(v)), []);

    const blurFrom = useCallback(() => {
        setFromMinutes(normalizeMinutes(fromMinutes));
        setFromSeconds(normalizeSeconds(fromSeconds));
    }, [fromMinutes, fromSeconds]);

    const blurTo = useCallback(() => {
        setToMinutes(normalizeMinutes(toMinutes));
        setToSeconds(normalizeSeconds(toSeconds));
    }, [toMinutes, toSeconds]);

    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", boxSizing: "border-box" }}>
            <DurationText text="Длительностью от" />
            <DurationPair
                label="От"
                minutes={fromMinutes}
                seconds={fromSeconds}
                onMinutesChange={handleFromMinutes}
                onSecondsChange={handleFromSeconds}
                onBlur={blurFrom}
                error={errorFrom}
                helperText={helperFrom}
            />
            <DurationText text="до" />
            <DurationPair
                label="До"
                minutes={toMinutes}
                seconds={toSeconds}
                onMinutesChange={handleToMinutes}
                onSecondsChange={handleToSeconds}
                onBlur={blurTo}
                error={errorTo}
                helperText={helperTo}
            />
        </Box>
    );
}


function DurationPair({
    label,
    minutes,
    seconds,
    onMinutesChange,
    onSecondsChange,
    onBlur,
    error,
    helperText,
}) {
    const borderColor = error ? "red" : "var(--palette-border-default)";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <Box
                aria-label={label}
                role="group"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    border: "1px solid",
                    borderColor,
                    borderRadius: 1,
                    padding: "6px 12px",
                    transition: "border-color .15s, box-shadow .15s",
                    "&:hover": { borderColor: error ? "red" : "var(--palette-border-primary)" },
                    "&:focus-within": {
                        borderColor: error ? "red" : "var(--base_button_active)",
                        boxShadow: error ? "0 0 0 2px rgba(255,0,0,.15)" : "0 0 0 2px rgba(0,0,0,.05)",
                    },
                }}
            >
                <DigitInput
                    value={minutes}
                    onChange={onMinutesChange}
                    onBlur={onBlur}
                    placeholder="мин"
                    minChars={1}
                />
                <Typography sx={{ fontSize: "0.8rem", lineHeight: "0.5rem" }}>мин</Typography>
                <DigitInput
                    value={seconds}
                    onChange={onSecondsChange}
                    onBlur={onBlur}
                    placeholder="сек"
                    minChars={2}
                />
                <Typography sx={{ fontSize: "0.8rem", lineHeight: "0.5rem" }}>сек</Typography>
            </Box>

            <span style={{ fontSize: "0.7rem", color: error ? "red" : "transparent" }}>
                {helperText}
            </span>
        </Box>
    );
}

function DigitInput({ value, onChange, onBlur, placeholder, minChars = 1 }) {
    const handleChange = React.useCallback(
        (e) => onChange?.(e.target.value),
        [onChange]
    );

    const ch = Math.max(String(value ?? "").length, minChars);

    return (
        <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            size={ch}
            style={{
                width: `${ch}ch`,
                padding: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.8rem",
                textAlign: "center",
                lineHeight: "0.8rem",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
            }}
        />
    );
}

function DurationText({ text }) {
    return (
        <Typography sx={{ fontSize: "0.9rem", mt: "0.3rem" }}>
            {text}
        </Typography>
    );
}


const onlyDigits = (r) => r.replace(/\D+/g, "");
const isValidMinutes = (m) => m !== "" && /^\d+$/.test(m);
const isValidSeconds = (s) => s !== "" && /^\d+$/.test(s) && Number(s) >= 0 && Number(s) <= 59;

const maskMinutes = (raw) => onlyDigits(raw).replace(/^0+(?=\d)/, "");
const maskSeconds = (raw) => onlyDigits(raw).slice(0, 2);

const normalizeMinutes = (m) => {
    const d = onlyDigits(m);
    if (d === "") return "0";
    return String(Math.max(0, Number(d)));
};

const normalizeSeconds = (s) => {
    const d = onlyDigits(s);
    if (d === "") return "00";
    const n = Math.min(59, Math.max(0, Number(d)));
    return String(n).padStart(2, "0");
};

const pairToSeconds = (m, s) => {
    if (!isValidMinutes(m) || !isValidSeconds(s)) return null;
    return Number(m) * 60 + Number(s);
};
