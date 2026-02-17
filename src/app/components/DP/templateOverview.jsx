import React, { useMemo } from "react";
import { Box, Typography, Divider } from "@mui/material";

const WEEKDAY_LABELS = {
    0: "Пн",
    1: "Вт",
    2: "Ср",
    3: "Чт",
    4: "Пт",
    5: "Сб",
    6: "Вс",
};

function minutesLabel(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "минуту";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "минуты";
    return "минут";
}

function formatWeekdays(days = []) {
    return days
    .map((d) => WEEKDAY_LABELS[String(d)])
    .filter(Boolean)
    .join(", ");
}

export default function TemplateOverview({ template, channelTransport, channelName }) {
    const header = useMemo(() => {
        if (!template) return "";
        const interval = Number(template.interval) || 0;
        const channel = channelName && channelTransport? ` через ${channelTransport.charAt(0).toUpperCase() + channelTransport.slice(1)} ${channelName}` : "";
        return `Рассылка с интервалом ${interval} ${minutesLabel(interval)}${channel}`;
    }, [template, channelTransport, channelName]);

    const lines = useMemo(() => {
        if (!template || !Array.isArray(template.send_timings) || !template.send_timings.length) {
            return [];
        }

        // Группируем по интервалу "start|end"
        const groups = new Map(); // key -> { ids: [], start, end }
        template.send_timings.forEach(({ id, start, end }) => {
            const key = `${start || ""}|${end || ""}`;
            if (!groups.has(key)) groups.set(key, { ids: [], start, end });
            groups.get(key).ids.push(id);
        });

        // Сортируем дни внутри группы и формируем строки
        return Array.from(groups.values()).map(({ ids, start, end }) => {
            ids.sort((a, b) => a - b);
            const days = formatWeekdays(ids);
            return `${days} — с ${start || ""} до ${end || ""}`;
        });
    }, [template]);

    if (!template) return null;

    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
            }}
        >
            
            <Box
                sx={{
                    position: "relative",
                    boxSizing: "border-box",
                    p: "10px 12px",
                    borderRadius: "8px",
                    backgroundColor: "var(--palette-background-default)",
                    color: "var(--palette-text-primary)",
                    maxWidth: "100%",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        right: "-10px",
                        bottom: "min(1rem, 15%)",
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "10px 0 10px 10px",
                        borderColor: "transparent transparent transparent var(--palette-background-default)",
                    },
                }}
            >
                <Typography
                    component="div"
                    sx={{
                        color: "var(--palette-text-secondary-light)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.5,
                        letterSpacing: "0.02rem",
                        fontWeight: 300,
                        fontStyle: "italic",
                    }}
                >
                    {header}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        mb: "0.5rem",
                    }}
                >
                    {lines.map((line, i) => (
                        <Typography
                            key={i}
                            component="div"
                            sx={{
                                color: "var(--palette-text-secondary-light)",
                                fontSize: "0.8125rem",
                                lineHeight: 1.45,
                                letterSpacing: "0.02rem",
                                fontWeight: 300,
                                fontStyle: "italic",
                            }}
                        >
                            {line}
                        </Typography>
                    ))}
                </Box>

                <Typography
                    component="div"
                    sx={{
                        color: "var(--palette-text-primary)",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontStyle: "normal",
                    }}
                >
                    {template.message_text || "—"}
                </Typography>
            </Box>


            {/* <Divider
                sx={{
                    borderColor: "var(--palette-border-primary)",
                    opacity: 0.6,
                }}
            /> */}

            
        </Box>
    );
}
