import React, { useEffect, useState } from "react";
import { Modal, Button, Box, CircularProgress } from "@mui/material";

import ModalHeader from "./modalHeader";
import TemplateName from "./templateName";
import TemplateChannelSelect from "./templateChannel";
import TemplateMessageText from "./messageText";
import AllowedTiming from "./allowedTiming";
import IntervalSlider from "./interval";


const DAYS_META = [
    { id: 0, name: "Пн" },
    { id: 1, name: "Вт" },
    { id: 2, name: "Ср" },
    { id: 3, name: "Чт" },
    { id: 4, name: "Пт" },
    { id: 5, name: "Сб" },
    { id: 6, name: "Вс" },
];


function normalizeWeekdays(sparse) {
    const indexById = new Map((sparse || []).map(d => [d.id, d]));
    return DAYS_META.map(d => {
        const item = indexById.get(d.id);
        if (item) {
            return {
                id: d.id,
                name: d.name,
                enabled: true,
                from: item.start || "08:00",
                to: item.end || "22:00",
            };
        }

        const isWeekend = d.id >= 5;
        return {
            id: d.id,
            name: d.name,
            enabled: false,
            from: isWeekend ? "10:00" : "08:00",
            to:   isWeekend ? "20:00" : "22:00",
        };
    });
}


const TIME_RE = /^(\d{1,2}):([0-5]\d)$/;

function parseTime(value) {
    const m = String(value || "").trim().match(TIME_RE);
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (Number.isNaN(h) || Number.isNaN(min) || h < 0 || h > 23) return null;
    return { h, min, total: h * 60 + min };
}

function fmtTime(h, min) {
    const hh = String(h).padStart(2, "0");
    const mm = String(min).padStart(2, "0");
    return `${hh}:${mm}`;
}

function normalizeTimeString(s) {
    const t = parseTime(s);
    return t ? fmtTime(t.h, t.min) : null;
}

function validateTimings(weekdays) {
    const errors = [];
    const enabled = (weekdays || []).filter(d => d.enabled);

    if (enabled.length === 0) {
        errors.push("Выберите как минимум один день отправки.");
        return { errors, normalized: [] };
    }

    const normalized = [];

    for (const d of enabled) {
        const fromN = normalizeTimeString(d.from);
        const toN = normalizeTimeString(d.to);

        if (!fromN || !toN) {
            errors.push(`Неверный формат времени в дне "${d.name}". Используйте чч:мм (например, 09:00).`);
            continue;
        }

        const fromT = parseTime(fromN);
        const toT = parseTime(toN);

        if (fromT.total >= toT.total) {
            errors.push(`В дне "${d.name}" время "с" должно быть меньше времени "по".`);
            continue;
        }

        normalized.push({
            id: d.id,
            start: fromN,
            end: toN,
        });
    }

    return { errors, normalized };
}

function compressWeekdays(full) {
    return (full || [])
        .filter(d => d.enabled)
        .map(d => ({ id: d.id, start: d.from, end: d.to }));
}


export default function TemplateModal({
    template,
    isModalOpen,
    handleClose,
    onProcess,
    isProcessing,
    headerName,
    actionName,
    serviceChannels,
}) {
    const [templateName, setTemplateName] = useState(template?.name || "");
    const [templateChannel, setTemplateChannel] = useState("");
    const [interval, setInterval] = useState(template?.interval || 1);
    const [templateMessageText, setTemplateMessageText] = useState(template?.message_text || "");
    const [weekdays, setWeekdays] = useState(() => normalizeWeekdays(template?.send_timings));
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (!serviceChannels || serviceChannels.length === 0) return;

        const pref = template?.channel != null ? String(template.channel) : "";
        const exists = serviceChannels.some((c) => String(c.id) === pref);

        if (exists) {
            setTemplateChannel(pref);
        } else {
            setTemplateChannel(String(serviceChannels[0].id));
        }
    }, [template?.channel, serviceChannels]);


    useEffect(() => {
        setWeekdays(normalizeWeekdays(template?.send_timings));
        setTemplateName(template?.name || "");
        setTemplateChannel(serviceChannels.find((c) => c.id === template?.channel)?.id || "");
        setTemplateMessageText(template?.message_text || "");
        setErrors([]);
    }, [template]);


    const handleValidateAndSubmit = () => {
        const nextErrors = [];

        const name = String(templateName || "").trim();
        if (!name) nextErrors.push("Название шаблона не должно быть пустым.");
        if (name.length >= 64) nextErrors.push("Название шаблона должно быть короче 64 символов.");

        const ch = String(templateChannel || "").trim();
        if (!ch.length) nextErrors.push('Выберите канал.');

        const msg = String(templateMessageText || "").trim();
        if (!msg) nextErrors.push("Текст сообщения не должен быть пустым.");
        if (msg.length <= 10 && msg.length !== 0) nextErrors.push("Слишком короткое сообщение.");
        if (msg.length >= 4096) nextErrors.push("Слишком длинное сообщение.");

        const { errors: timingErrors, normalized } = validateTimings(weekdays);
        nextErrors.push(...timingErrors);

        if (nextErrors.length > 0) {
            setErrors(nextErrors);
            return;
        }

        const payload = {
            ...template,
            name,
            channel: templateChannel,
            message_text: msg,
            interval: interval,
            send_timings: normalized, 
        };

        setErrors([]);
        onProcess(payload);
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            sx={{
                display: "grid",
                placeItems: "center",
                p: 2,
                outline: "none",
            }}
        >
            <Box
                sx={{
                    width: "min(960px, 90vw)",
                    maxHeight: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    border: "1px solid var(--palette-border-primary)",
                    background: "var(--palette-background-primary)",
                    boxSizing: "border-box",
                    borderRadius: 0,
                    boxShadow: 24,

                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--palette-border-default)",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "var(--palette-border-primary)",
                    },

                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--palette-border-default) transparent",
                }}
            >
                <ModalHeader handleClose={handleClose} headerName={headerName} />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "65fr 35fr",
                        gap: "1rem",
                        p: "0.5rem",
                        boxSizing: "border-box",
                        height: "100%",
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: 0,
                            gap: "1rem",
                        }}
                    >
                        <TemplateName
                            templateName={templateName}
                            setTemplateName={setTemplateName}
                        />
                        <TemplateChannelSelect
                            channel={templateChannel}
                            setChannel={(v) => setTemplateChannel(String(v))}
                            serviceChannels={serviceChannels}
                        />
                        <IntervalSlider
                            interval={interval}
                            setInterval={setInterval}
                        />
                        <TemplateMessageText
                            messageText={templateMessageText}
                            setMessageText={setTemplateMessageText}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            boxSizing: "border-box",
                            gap: "1rem",
                            height: "100%",
                            minHeight: 0,
                        }}
                    >
                        <AllowedTiming
                            value={weekdays}
                            onChange={setWeekdays}
                        />
                    </Box>
                </Box>

                {errors.length > 0 && (
                    <Box
                        sx={{
                            m: "0.5rem",
                            p: "0.75rem 1rem",
                            border: "1px solid var(--palette-border-default)",
                            background: "transparent",
                            color: "#F26E6E",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                        }}
                    >
                        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                            {errors.map((e, i) => (
                                <li key={i}>{e}</li>
                            ))}
                        </ul>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        p: "1rem 0.8rem",
                        boxSizing: "border-box",
                    }}
                >
                    <Button
                        sx={{
                            width: "fit-content",
                            ml: "auto",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "0.25rem",
                            boxSizing: "border-box",
                            background: "var(--button_blue)",
                            color: "white",
                            px: "2.5rem",
                            transition: "opacity 0.1s ease-in-out",
                            "&:hover": { opacity: 0.85 },
                            "&:disabled": { opacity: 0.85 },
                        }}
                        onClick={handleValidateAndSubmit}
                        disabled={isProcessing}
                    >
                        <span>{actionName}</span>
                        {isProcessing && (
                            <CircularProgress size={"1rem"} sx={{ ml: "0.5rem" }} />
                        )}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
