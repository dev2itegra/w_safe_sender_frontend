import React, { useEffect, useMemo, useState } from "react";
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
    ListSubheader,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ALL_VALUE = "__ALL__";
const keyOf = (pipelineId, statusId) => `${pipelineId}:${statusId}`;
const parseKey = (key) => {
    const [p, s] = String(key).split(":");
    return { pipelineId: Number(p), statusId: Number(s) };
};

export function Statuses({
    pipelines = [],
    value = [],
    onChange,
    allSelected = false,
    onToggleAll,
}) {
    const allKeys = useMemo(() => {
        const acc = [];
        for (const pipe of pipelines) for (const st of (pipe.statuses ?? [])) acc.push(keyOf(pipe.id, st.id));
        return acc;
    }, [pipelines]);
    const allSet = useMemo(() => new Set(allKeys), [allKeys]);

    const isAllSelected =
        !!allSelected || (allKeys.length > 0 && value.length === allKeys.length);

    const labelByKey = useMemo(() => {
        const map = new Map();
        for (const pipe of pipelines) {
            for (const st of (pipe.statuses ?? [])) {
                map.set(keyOf(pipe.id, st.id), st.name);
            }
        }
        return map;
    }, [pipelines]);

    const pipelineNameByKey = useMemo(() => {
        const map = new Map();
        for (const pipe of pipelines) {
            for (const st of (pipe.statuses ?? [])) {
                map.set(keyOf(pipe.id, st.id), pipe.name);
            }
        }
        return map;
    }, [pipelines]);

    const colorByKey = useMemo(() => {
        const map = new Map();
        for (const pipe of pipelines) {
            for (const st of (pipe.statuses ?? [])) {
                map.set(keyOf(pipe.id, st.id), st.color);
            }
        }
        return map;
    }, [pipelines]);

    const [expanded, setExpanded] = useState(() => new Set());
    const toggleExpanded = (pipelineId) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(pipelineId)) next.delete(pipelineId);
            else next.add(pipelineId);
            return next;
        });
    };

    useEffect(() => {
        if (allSelected) return;
        const next = (value ?? []).filter((k) => allSet.has(k));
        if (next.length !== value.length) onChange?.(next);
    }, [allSelected, allKeys.join("|"), value.join("|")]);

    const handleChange = (event) => {
        const next = event.target.value;

        if (isAllSelected) {
            const keys = (Array.isArray(next) ? next : []).filter((v) => v !== ALL_VALUE);
            if (keys.length === 1) {
                onToggleAll?.(false);
                onChange?.(allKeys.filter((k) => k !== keys[0]));
                return;
            }
        }

        if (Array.isArray(next) && next.includes(ALL_VALUE)) {
            onToggleAll?.(!isAllSelected);
            return;
        }

        const cleaned = (Array.isArray(next) ? next : []).filter((v) => v !== ALL_VALUE);

        if (cleaned.length === allKeys.length && allKeys.length > 0) {
            onToggleAll?.(true);
            return;
        }

        if (allSelected) onToggleAll?.(false);
        onChange?.(cleaned);
    };

    const toggleStatus = (key) => {
        if (isAllSelected) {
            onToggleAll?.(false);
            onChange?.(allKeys.filter((kk) => kk !== key));
            return;
        }
        const set = new Set(value);
        if (set.has(key)) set.delete(key);
        else set.add(key);

        if (set.size === allKeys.length && allKeys.length > 0) {
            onToggleAll?.(true);
            return;
        }
        onChange?.(Array.from(set));
    };

    const renderSelected = useMemo(() => {
        if (isAllSelected) return "Все";
        if (!value?.length) return <span style={{ opacity: 0.6 }}>Не выбрано</span>;

        const byPipeline = new Map();
        value.forEach((key) => {
            const pipe = pipelineNameByKey.get(key) ?? "Без воронки";
            const label = labelByKey.get(key) ?? String(key);
            if (!byPipeline.has(pipe)) byPipeline.set(pipe, []);
            byPipeline.get(pipe).push({ key, label });
        });

        return (
            <Box sx={{ display: "grid", gap: 0.5 }}>
                {[...byPipeline.entries()].map(([pipe, items]) => (
                    <Box key={pipe} sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                        <Box sx={{ fontSize: 12, opacity: 0.7, whiteSpace: "nowrap" }}>{pipe}:</Box>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                            {items.map(({ key, label }) => (
                                <Chip
                                    key={key}
                                    label={label}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        maxWidth: 220,
                                        bgcolor: "var(--palette-chip-bg, rgba(25,118,210,0.2))",
                                        color: "var(--palette-chip-text, var(--palette-text-primary))",
                                        "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Box>
        );
    }, [isAllSelected, value, labelByKey, pipelineNameByKey]);

    const pipelineStats = (pipelineId) => {
        const keys = (pipelines.find((p) => p.id === pipelineId)?.statuses ?? []).map((st) => keyOf(pipelineId, st.id));
        const picked = isAllSelected ? keys.length : keys.filter((k) => value.includes(k)).length;
        return { total: keys.length, picked };
    };

    const selectValue = isAllSelected ? [ALL_VALUE] : value;

    return (
        <Box sx={{ minWidth: 360 }}>
            <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="statuses-label" shrink sx={{ color: "var(--palette-text-primary)" }}>
                    Этапы
                </InputLabel>

                <Select
                    labelId="statuses-label"
                    id="statuses-select"
                    multiple
                    value={selectValue}
                    onChange={handleChange}
                    label="Этапы"
                    displayEmpty
                    renderValue={() => renderSelected}
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
                            },
                        },
                        MenuListProps: {
                            dense: true,
                            sx: {
                                py: 0.5,
                                "& .MuiMenuItem-root": {
                                    "&:hover": { backgroundColor: "rgba(195, 195, 195, 0.87)" },
                                    "&.Mui-selected": { backgroundColor: "transparent" },
                                    "&.Mui-selected:hover": { backgroundColor: "rgba(195, 195, 195, 0.87)" },
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
                                color: "var(--palette-text-primary)",
                                "&.Mui-checked": { color: "var(--palette-text-secondary-dark-green)" },
                                "&:hover": { backgroundColor: "transparent" },
                            }}
                        />
                        <ListItemText primary="Все" sx={{ "& .MuiListItemText-primary": { fontSize: 14 } }} />
                    </MenuItem>

                    {pipelines.map((pipe) => {
                        const { total, picked } = pipelineStats(pipe.id);
                        const isOpen = expanded.has(pipe.id);

                        return (
                            <React.Fragment key={pipe.id}>
                                <ListSubheader
                                    disableSticky
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => toggleExpanded(pipe.id)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1,
                                        cursor: "pointer",
                                        lineHeight: "36px",
                                        px: 2,
                                        bgcolor: "transparent",
                                        color: "var(--palette-text-primary)",
                                        fontSize: 12,
                                        fontWeight: 400,
                                        "&:hover": { backgroundColor: "rgba(195, 195, 195, 0.87)" },
                                    }}
                                >
                                    <span>
                                        {pipe.name} {total > 0 ? `— ${picked}/${total}` : ""}
                                    </span>
                                    {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </ListSubheader>

                                {isOpen &&
                                    (pipe.statuses ?? []).map((st) => {
                                        const k = keyOf(pipe.id, st.id);
                                        const checked = isAllSelected ? true : value.includes(k);
                                        const color = colorByKey.get(k);

                                        return (
                                            <MenuItem
                                                key={k}
                                                value={k}
                                                disableRipple
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleStatus(k);
                                                }}
                                                sx={{
                                                    alignItems: "center",
                                                    gap: 1,
                                                    pl: 4,
                                                    ...(color ? { backgroundColor: color } : {}),
                                                    "&:hover": { backgroundColor: "rgba(195, 195, 195, 0.87)" },
                                                    "&.Mui-selected": { backgroundColor: color ?? "transparent" },
                                                    "&.Mui-selected:hover": { backgroundColor: "rgba(195, 195, 195, 0.87)" },
                                                    "&.Mui-focusVisible": { backgroundColor: color ?? "transparent" },
                                                }}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => toggleStatus(k)}
                                                    sx={{
                                                        p: 0.5,
                                                        color: "var(--palette-text-secondary-dark-green)",
                                                        "&.Mui-checked": { color: "var(--palette-text-secondary-dark-green)" },
                                                        "&:hover": { backgroundColor: "transparent" },
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={st.name}
                                                    sx={{
                                                        "& .MuiListItemText-primary": {
                                                            fontSize: 14,
                                                            fontWeight: 400,
                                                            ...(color ? { color: "black" } : {}),
                                                        },
                                                    }}
                                                />
                                            </MenuItem>
                                        );
                                    })}
                            </React.Fragment>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
