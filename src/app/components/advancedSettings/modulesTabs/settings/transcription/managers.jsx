import React, { useEffect, useMemo } from "react";
import {
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    Chip,
    Stack,
} from "@mui/material";

const ALL_VALUE = "__ALL__";

export function Managers({
    managersList = [],
    value = [],
    onChange,
    allSelected = false,
    onToggleAll,
}) {
    const allIds = useMemo(() => managersList.map((m) => m.id), [managersList]);
    const allIdsSet = useMemo(() => new Set(allIds), [allIds]);

    const isAllSelected =
        !!allSelected || (allIds.length > 0 && value.length === allIds.length);

    const nameById = useMemo(() => {
        const map = new Map();
        managersList.forEach((m) => map.set(m.id, m.name));
        return map;
    }, [managersList]);

    useEffect(() => {
        if (allSelected) return;
        const next = value.filter((id) => allIdsSet.has(id));
        if (next.length !== value.length) onChange?.(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSelected, allIds.join("|"), value.join("|")]);

    const handleChange = (event) => {
        const next = event.target.value;

        if (isAllSelected) {
            const ids = (Array.isArray(next) ? next : []).filter((v) => v !== ALL_VALUE);
            if (ids.length === 1) {
                onToggleAll?.(false);
                onChange?.(allIds.filter((id) => id !== ids[0]));
                return;
            }
        }

        if (next.includes?.(ALL_VALUE)) {
            onToggleAll?.(!isAllSelected);
            return;
        }

        const cleaned = next.filter((v) => v !== ALL_VALUE);

        if (cleaned.length === allIds.length && allIds.length > 0) {
            onToggleAll?.(true);
            return;
        }

        if (allSelected) onToggleAll?.(false);
        onChange?.(cleaned);
    };

    const renderValue = useMemo(() => {
        if (isAllSelected) return "Все";
        if (!value || value.length === 0) return <span style={{ opacity: 0.6 }}>Не выбрано</span>;
        return (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
                {value.map((id) => {
                    const label = nameById.get(id) ?? id;
                    return (
                        <Chip
                            key={id}
                            label={label}
                            size="small"
                            sx={{
                                height: 22,
                                bgcolor: "var(--palette-chip-bg, rgba(25,118,210,0.2))",
                                color: "var(--palette-chip-text, var(--palette-text-primary))",
                            }}
                        />
                    );
                })}
            </Stack>
        );
    }, [isAllSelected, value, nameById]);

    const selectValue = isAllSelected ? [ALL_VALUE] : value;

    return (
        <Box sx={{ minWidth: 320 }}>
            <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="managersList-label" shrink sx={{ color: "var(--palette-text-primary)" }}>
                    Менеджеры
                </InputLabel>

                <Select
                    labelId="managersList-label"
                    id="managersList-select"
                    multiple
                    value={selectValue}
                    onChange={handleChange}
                    label="Менеджеры"
                    displayEmpty
                    renderValue={() => renderValue}
                    sx={{
                        color: "var(--palette-text-primary)",
                        "& .MuiSelect-icon": { color: "var(--palette-text-primary)" },
                        "& .MuiSelect-select": { py: 0.5, minHeight: 0 },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--palette-border-default)" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--palette-text-primary)" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--palette-border-primary)" },
                        backgroundColor: "transparent",
                        borderRadius: 1,
                        py: "0.25rem",
                    }}
                    MenuProps={{
                        disableAutoFocusItem: true,
                        PaperProps: {
                            sx: {
                                maxHeight: "min(420px, calc(100vh - 48px))",
                                bgcolor: "var(--palette-background-default)",
                                color: "var(--palette-text-primary)",
                                border: "1px solid var(--palette-border-default)",
                                boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
                                borderRadius: 1.5,
                                mt: 0.5,
                                width: 420,
                                "& .MuiMenuItem-root.Mui-selected": {
                                    bgcolor: "var(--palette-select-selected, rgba(25,118,210,0.08))",
                                },
                                "& .MuiMenuItem-root.Mui-selected:hover": {
                                    bgcolor: "var(--palette-select-selected-hover, rgba(25,118,210,0.12))",
                                },
                            },
                        },
                        MenuListProps: {
                            dense: true,
                            sx: {
                                py: 0.5,
                                "& .MuiMenuItem-root": {
                                    "&:hover": { backgroundColor: "var(--palette-table-hover-background)" },
                                    "&.Mui-focusVisible": { backgroundColor: "transparent" },
                                },
                            },
                        },
                    }}
                >
                    <MenuItem
                        value={ALL_VALUE}
                        disableRipple
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleAll?.(!isAllSelected);
                        }}
                        sx={{ alignItems: "center", gap: 1 }}
                    >
                        <Checkbox
                            checked={isAllSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => onToggleAll?.(!isAllSelected)}
                            sx={{
                                p: 0.5,
                                color: "var(--palette-text-secondary-dark-green)",
                                "&.Mui-checked": { color: "var(--palette-text-secondary-dark-green)" },
                                "&:hover": { backgroundColor: "transparent" },
                            }}
                        />
                        <ListItemText primary="Все" sx={{ "& .MuiListItemText-primary": { fontSize: 14 } }} />
                    </MenuItem>

                    {managersList.map((m) => {
                        const checked = isAllSelected ? true : value.includes(m.id);
                        return (
                            <MenuItem
                                key={m.id}
                                value={m.id}
                                disableRipple
                                sx={{ alignItems: "center", gap: 1 }}
                                onClick={(e) => {
                                    if (isAllSelected) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleAll?.(false);
                                        onChange?.(allIds.filter((id) => id !== m.id));
                                    }
                                }}
                            >
                                <Checkbox
                                    checked={checked}
                                    sx={{
                                        p: 0.5,
                                        color: "var(--palette-text-secondary-dark-green)",
                                        "&.Mui-checked": { color: "var(--palette-text-secondary-dark-green)" },
                                        "&:hover": { backgroundColor: "transparent" },
                                    }}
                                />
                                <ListItemText
                                    primary={m.name}
                                    sx={{ "& .MuiListItemText-primary": { fontSize: 14, fontWeight: 400 } }}
                                />
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
