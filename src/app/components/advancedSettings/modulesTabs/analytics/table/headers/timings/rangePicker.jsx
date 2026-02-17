import React from "react";
import { Box, Typography, Popover, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { alpha } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.updateLocale("ru", { weekStart: 1 });
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("ru");

const EDGE_FG = "#fff";

function format(d) {
    return d ? dayjs(d).format("DD.MM.YYYY") : "Не указано";
}
const isSame = (a, b) => !!a && !!b && dayjs(a).isSame(b, "day");
const isBefore = (a, b) => !!a && !!b && dayjs(a).isBefore(b, "day");
const isAfter = (a, b) => !!a && !!b && dayjs(a).isAfter(b, "day");
const isBetween = (d, start, end) => {
    if (!start || !end) return false;
    const dd = dayjs(d).startOf("day");
    return dd.isAfter(dayjs(start).startOf("day")) && dd.isBefore(dayjs(end).startOf("day"));
};

function RangeDay(props) {
    const { day, outsideCurrentMonth, start, end, hover, ...rest } = props;

    const selecting = start && !end;
    const previewEnd = selecting ? hover : null;
    const hasPreview = selecting && previewEnd && !isSame(previewEnd, start);

    const startDay = start;
    const endDay = end || (hasPreview ? (isAfter(previewEnd, startDay) ? previewEnd : startDay) : end);

    const isStart = startDay && isSame(day, startDay);
    const isEnd = endDay && isSame(day, endDay) && !isSame(day, startDay);
    const inRange = isBetween(day, startDay, endDay);
    const inPrev = hasPreview && isBetween(day, startDay, endDay);

    const leftHalf = isStart && endDay && isAfter(endDay, startDay);
    const rightHalf = isEnd && startDay && isBefore(startDay, endDay);

    return (
        <PickersDay
            {...rest}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            disableMargin
            sx={(theme) => ({
                position: "relative",
                width: 32,
                height: 32,
                fontSize: 12,

                ...(inRange && {
                    backgroundColor: alpha(theme.palette.primary.main, 0.18),
                    borderRadius: 0,
                    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.24) },
                }),
                ...(inPrev && !inRange && {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    borderRadius: 0,
                }),
                ...(leftHalf && {
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.18)} 50%, transparent 50%)`,
                }),
                ...(rightHalf && {
                    background: `linear-gradient(90deg, transparent 50%, ${alpha(theme.palette.primary.main, 0.18)} 50%)`,
                }),
                ...(isStart && {
                    backgroundColor: theme.palette.primary.main,
                    color: EDGE_FG,
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                }),
                ...(isEnd && {
                    backgroundColor: theme.palette.primary.main,
                    color: EDGE_FG,
                    borderRadius: "50%",
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                }),
                "&.MuiPickersDay-today": {
                    border: "none",
                    "& span": { borderBottom: `2px solid ${theme.palette.primary.main}` },
                },
            })}
        />
    );
}

export default function RangePicker({ start, setStart, end, setEnd }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [hoverDay, setHoverDay] = React.useState(null);

    React.useEffect(() => {
        dayjs.locale("ru");
    }, []);

    const open = Boolean(anchorEl);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.1rem", }}>
                    <Typography variant="caption" sx={{ color: "var(--palette-text-secondary-light)" }}>
                        С
                    </Typography>
                    <Typography sx={{ color: "var(--palette-text-primary)" }}>{format(start)}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.1rem",}}>
                    <Typography variant="caption" sx={{ color: "var(--palette-text-secondary-light)" }}>
                        По
                    </Typography>
                    <Typography sx={{ color: "var(--palette-text-primary)" }}>{format(end)}</Typography>
                </Box>

                <Button
                    variant="text"
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        color: "var(--button_blue)",
                        ml: "auto",
                        alignSelf: "flex-end",
                        lineHeight: 1.65,
                        p: 0,
                    }}
                >
                    Изменить
                </Button>
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            p: 1,
                            backgroundColor: "var(--palette-background-primary)",
                            color: "var(--palette-text-primary)",
                            border: "1px solid var(--palette-border-primary)",
                            "& .MuiSvgIcon-root": {
                                color: "var(--palette-text-secondary-light)",
                            },

                            "& .MuiPickersCalendarHeader-root": {
                                color: "var(--palette-text-primary)",
                            },
                            "& .MuiPickersCalendarHeader-label": {
                                color: "var(--palette-text-primary)",
                            },

                            "& .MuiPickersCalendarHeader-switchViewButton": {
                                color: "var(--palette-text-secondary-light)",
                                '&&:hover': { backgroundColor: "transparent" },
                            },

                            "& .MuiPickersArrowSwitcher-root": {
                                "& .MuiIconButton-root": {
                                    color: "var(--palette-text-secondary-light)",
                                    '&&:hover': { backgroundColor: "transparent" },
                                },
                            },
                        },
                    },
                }}
            >
                <Box sx={{ px: 1, pt: 1 }}>
                    <DateCalendar
                        onChange={(newDay) => {
                            if (!start || (start && end)) {
                                setStart(newDay);
                                setEnd(null);
                                setHoverDay(null);
                                return;
                            }
                            if (dayjs(newDay).isBefore(start, "day")) {
                                setEnd(start);
                                setStart(newDay);
                            } else {
                                setEnd(newDay);
                            }
                            setHoverDay(null);
                        }}
                        onMonthChange={() => setHoverDay(null)}
                        onYearChange={() => setHoverDay(null)}
                        dayOfWeekFormatter={(day) => {
                            if (day && typeof day.format === "function") {
                                const dd = day.locale("ru").format("dd");
                                return dd.charAt(0).toUpperCase() + dd.charAt(1);
                            }
                            const s = String(day);
                            return s.slice(0, 2).charAt(0).toUpperCase() + s.slice(0, 2).charAt(1);
                        }}
                        sx={{
                            '&&': {
                                height: 280,
                                maxHeight: 280,
                                width: 320,
                            },
                            "& .MuiDayCalendar-header": {
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 32px)",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 0,
                            },
                            "& .MuiDayCalendar-weekDayLabel": {
                                width: 32,
                                height: 32,
                                display: "grid",
                                placeItems: "center",
                                fontSize: 12,
                                lineHeight: 1,
                                textTransform: "none",
                                padding: 0,
                                margin: 0,
                                color: "var(--palette-text-secondary-light)",
                            },
                            "& .MuiPickersDay-root": {
                                width: 32,
                                height: 32,
                                fontSize: 12,
                                margin: 0,
                                color: "var(--palette-text-primary)",
                            },
                        }}
                        slots={{
                            day: (ownerProps) => (
                                <RangeDay
                                    {...ownerProps}
                                    start={start}
                                    end={end}
                                    hover={hoverDay}
                                    onMouseEnter={() => {
                                        if (start && !end) setHoverDay(ownerProps.day);
                                    }}
                                />
                            ),
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1,
                            pt: 1,
                            borderTop: "1px solid var(--palette-border-primary)",
                        }}
                    >
                        <Button
                            variant="text"
                            size="small"
                            color="inherit"
                            onClick={() => {
                                setStart(null);
                                setEnd(null);
                                setHoverDay(null);
                            }}
                            sx={{
                                '&&': { color: 'var(--button_blue)' },
                                '&&:hover': { color: 'var(--button_blue)', backgroundColor: 'transparent' },
                            }}
                        >
                            Очистить
                        </Button>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                color="inherit"
                                onClick={() => setAnchorEl(null)}
                                sx={{
                                    '&&': {
                                        color: 'var(--button_blue)',
                                        borderColor: 'var(--button_blue)',
                                    },
                                    '&&:hover': {
                                        color: 'var(--button_blue)',
                                        borderColor: 'var(--button_blue)',
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                Ок
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Popover>
        </LocalizationProvider>
    );
}
