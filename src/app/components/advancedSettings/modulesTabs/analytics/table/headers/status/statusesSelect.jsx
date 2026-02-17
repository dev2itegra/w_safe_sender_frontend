import React from "react";
import {
    Box,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    FormControl,
    InputLabel,
} from "@mui/material";

const ALL_VALUE = "__all__";

export default function StatusesMultiSelect({
    label = "Этапы",
    options = [],     
    value = [],         
    onChange,
    disabled = false,
    width = 280,
}) {
    const ids = options.map(o => o.id);
    const allChecked = value.length === ids.length && ids.length > 0;
    const someChecked = value.length > 0 && value.length < ids.length;

    const handleChange = (e) => {
        let v = e.target.value;
        const last = v[v.length - 1];

        if (last === ALL_VALUE) {
            onChange(ids);
            return;
        }

        v = v.filter((x) => x !== ALL_VALUE);

        if (v.length === 0) {
            onChange(ids);
            return;
        }

        if (v.length === ids.length) {
            onChange(ids);
            return;
        }

        onChange(v);
    };

    return (
        <FormControl
            size="small"
            disabled={disabled || options.length === 0}
            sx={{ minWidth: width }}
        >
            <InputLabel
                shrink
                sx={{
                    fontSize: "0.8125rem",
                    color: "var(--palette-border-default)",
                    "&.Mui-focused": { color: "var(--button_blue)" },
                }}
            >
                {label}
            </InputLabel>

            <Select
                multiple
                label={label}
                value={value}
                onChange={handleChange}
                displayEmpty
                sx={{
                    fontSize: "0.8125rem",
                    color: "var(--palette-text-primary)",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--palette-border-default)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--button_blue)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--button_blue)",
                    },
                    "& .MuiSelect-select": {
                        py: "8.5px",
                        minHeight: 0,
                        fontSize: "0.8125rem",
                        color: "var(--palette-text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    },
                    "& .MuiSvgIcon-root": {
                        color: "var(--palette-text-primary)",
                    },
                }}
                renderValue={(selected) => {
                    if (selected.length === ids.length) return "Все этапы";
                    const selectedNames = options
                        .filter((opt) => selected.includes(opt.id))
                        .map((opt) => opt.name);
                    return (
                        <Box sx={{display: "flex", flexDirection: "column", }} >
                            {
                                selectedNames.map((n, key) => {
                                    return <span key={key}>{n}</span>
                                })
                            }
                        </Box>
                    );
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            background: "var(--palette-background-primary)",
                            border: "1px solid var(--palette-border-primary)",
                            "& .MuiMenuItem-root": {
                                color: "var(--palette-text-primary)",
                                fontSize: "0.8125rem",
                                py: 0.5,
                                "& .MuiTypography-root": {
                                    fontSize: "0.8125rem",
                                },
                            },
                            "& .MuiCheckbox-root": {
                                color: "var(--palette-text-primary)",
                                "&.Mui-checked": {
                                    color: "var(--button_blue)",
                                },
                                "&.MuiCheckbox-indeterminate": {
                                    color: "var(--button_blue)",
                                },
                                p: 0.5,
                            },
                            "& .MuiListItemText-root": {
                                m: 0,
                            },
                        },
                    },
                }}
            >
                <MenuItem value={ALL_VALUE}>
                    <Checkbox checked={allChecked} indeterminate={someChecked} />
                    <ListItemText primary="Выбрать все" />
                </MenuItem>

                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                        <Checkbox checked={allChecked || value.includes(opt.id)} />
                        <ListItemText primary={opt.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
