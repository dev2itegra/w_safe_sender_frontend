import React from "react";
import { Box, Button, Select, FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/ru";
import { ruRU } from "@mui/x-date-pickers/locales";


export function Filters(
    {
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        callType,
        setCallType,
        isProcessing,
        managerId,
        setManagerId,
        managersList,
        onSearch,
        contactId,
        setContactId,
    }
) {
    return (
        <Box
            sx={{
                background: "var(--palette-background-primary)",
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                padding: "1rem",
            }}
        >
            <CallType callType={callType} setCallType={setCallType}/>
            <ContactId contactId={contactId} setContactId={setContactId}/>
            <DateRange dateTo={dateTo} setDateTo={setDateTo} dateFrom={dateFrom} setDateFrom={setDateFrom}/>
            <Manager managerId={managerId} setManagerId={setManagerId} managersList={managersList} />
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
                    "&:disabled" : { opacity: 0.85 },
                }}
                onClick={async () => {
                    await onSearch();
                }}
                disabled={isProcessing}
            >
                <span>{"Поиск"}</span>
                <SearchIcon 
                    sx={{
                        pt: "0.1rem",
                        fontSize: "1.1rem", 
                        fontWeight: 500,
                    }}
                />
            </Button>
        </Box>
    );
}


function DateRange({
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    colors = {
        background: "var(--palette-background-primary)",
        border: "var(--palette-border-default)",
        text: "var(--palette-text-primary)",
        accent: "var(--palette-accent, #1976d2)",
    },
}) {
    const inputWidth = "10rem";

    const common = {
        ampm: false,
        format: "DD.MM.YYYY HH:mm",
        sx: { width: inputWidth },
        enableAccessibleFieldDOMStructure: false,
        slots: { textField: TextField },
        slotProps: {
            textField: {
                size: "small",
                InputLabelProps: {
                    sx: {
                        color: colors.border,
                        "&.Mui-focused": { color: colors.accent },
                    },
                },
                sx: {
                    "& .MuiOutlinedInput-root": {
                        color: colors.text,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.border,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                    },
                    "& .MuiInputBase-input": { color: colors.text },
                    "& .MuiSvgIcon-root": { color: colors.text },
                },
            },
            openPickerButton: {
                sx: {
                    color: colors.text,
                    "&:hover": { color: colors.accent },
                },
            },
            popper: {
                sx: {
                    "& .MuiPaper-root": {
                        backgroundColor: colors.background,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 1.25,
                    },
                    "& .MuiPickersCalendarHeader-label": { color: colors.text },
                    "& .MuiPickersDay-root": { color: colors.text },
                    "& .MuiPickersToolbar-root": {
                        backgroundColor: "transparent",
                        color: colors.text,
                    },
                    "& .MuiPickersLayout-root .MuiButton-root": {
                        color: colors.accent,
                        textTransform: "none",
                        fontSize: "0.85rem",
                    },
                },
            },
        }

    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ru"
                localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
            >
                <Box sx={{ display: "flex", gap: "0.25rem" }}>
                    <DateTimePicker
                        {...common} 
                        label="Звонки в период с"
                        value={dateFrom ?? null}
                        onChange={setDateFrom}
                        maxDateTime={dateTo ?? undefined}
                    />
                    <DateTimePicker
                        {...common}
                        label="Звонки в период до"
                        value={dateTo ?? null}
                        onChange={setDateTo}
                        minDateTime={dateFrom ?? undefined}
                    />
                </Box>
            </LocalizationProvider>
        </Box>
    );
}

function ContactId({
    contactId,
    setContactId,
    colors = {
        border: "var(--palette-border-default)",
        text: "var(--palette-text-primary)",
        accent: "var(--palette-accent, #1976d2)",
    },
}) {
    const handleChange = (e) => {
        const digits = e.target.value.replace(/\D+/g, "");
        if (digits === "") {
            setContactId(0);
            return;
        }
        const num = parseInt(digits, 10);
        setContactId(Number.isFinite(num) && num > 0 ? num : 0);
    };

    return (
        <Box sx={{ width: "12rem" }}>
            <FormControl fullWidth size="small">
                <TextField
                    label="ID контакта"
                    value={contactId === 0 ? "" : String(contactId)}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: colors.text,
                            "& fieldset": { borderColor: colors.border },
                            "&:hover fieldset": { borderColor: colors.accent },
                            "&.Mui-focused fieldset": { borderColor: colors.accent },
                        },
                        "& .MuiInputLabel-root": {
                            color: colors.border,
                            "&.Mui-focused": { color: colors.accent },
                        },
                        "& .MuiInputBase-input": { color: colors.text },
                    }}
                />
            </FormControl>
        </Box>
    );
}


function CallType({
    callType,
    setCallType,
    colors = {
        border: "var(--palette-border-default)",
        text: "var(--palette-text-primary)",
        accent: "var(--palette-accent, #1976d2)",
    },
}) {
    return (
        <Box sx={{ width: "12rem" }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="calltype-label"
                    sx={{
                        color: colors.border,
                        "&.Mui-focused": { color: colors.accent },
                    }}
                >
                    Тип звонка
                </InputLabel>
                <Select
                    labelId="calltype-label"
                    id="calltype"
                    value={callType ?? "any"}
                    label="Тип звонка"
                    onChange={(e) => setCallType(e.target.value)}
                    sx={{
                        color: colors.text,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.border,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                        "& .MuiSelect-select": {
                            py: "8.5px",
                            minHeight: 0,
                            color: colors.text,
                        },
                        "& .MuiSvgIcon-root": {
                            color: colors.text,
                        },
                    }}
                    MenuProps={
                        {
                            PaperProps: {
                                sx: {
                                    background: "var(--palette-background-primary)",
                                    border: `1px solid ${colors.border}`,
                                    "& .MuiMenuItem-root": {
                                        color: colors.text,
                                        "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                        "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                        "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                    },
                                },
                            }
                        }
                    }
                >
                    <MenuItem value={"any"}>Любой</MenuItem>
                    <MenuItem value={"incoming"}>Входящий</MenuItem>
                    <MenuItem value={"outgoing"}>Исходящий</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}


function Manager(
    {
        managerId,
        setManagerId,
        managersList,
        colors = {
            border: "var(--palette-border-default)",
            text: "var(--palette-text-primary)",
            accent: "var(--palette-accent, #1976d2)",
        },
    }
) {

    return (
        <Box sx={{ width: "12rem" }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="manager-label"
                    sx={{
                        color: colors.border,
                        "&.Mui-focused": { color: colors.accent },
                    }}
                >
                    Ответственный
                </InputLabel>
                <Select
                    labelId="manager-label"
                    id="manager"
                    value={managerId ?? "0"}
                    label="Ответственный"
                    onChange={(e) => setManagerId(Number(e.target.value))}
                    sx={{
                        color: colors.text,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.border,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.accent,
                        },
                        "& .MuiSelect-select": {
                            py: "8.5px",
                            minHeight: 0,
                            color: colors.text,
                        },
                        "& .MuiSvgIcon-root": {
                            color: colors.text,
                        },
                    }}
                    MenuProps={
                        {
                            PaperProps: {
                                sx: {
                                    background: "var(--palette-background-primary)",
                                    border: `1px solid ${colors.border}`,
                                    "& .MuiMenuItem-root": {
                                        color: colors.text,
                                        "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                        "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                        "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                    },
                                },
                            }
                        }
                    }
                >
                    <MenuItem value={"0"}>Все</MenuItem>
                    {managersList? managersList.map((m) => {
                        return (
                            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                        )
                    }) : <></>}
                </Select>
            </FormControl>
        </Box>
    );
}