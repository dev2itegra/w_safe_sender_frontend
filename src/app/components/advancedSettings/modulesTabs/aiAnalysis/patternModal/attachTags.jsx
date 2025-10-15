import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    ListItemText,
    Checkbox as MuiCheckbox,
} from "@mui/material";

import { amoApiInstance } from "../../../../../services/requests/amoAPI";
import { sendAmoErrorNotification } from "../../../../../services/amoNotification/sendNotification";

const CREATE_SENTINEL = "__create__";


export function AttachTags({
    isEnabled,
    setIsEnabled,
    tags,
    setTags,
    entity,
    setEntity,
}) {
    const [crmTags, setCrmTags] = useState([]);              // [{ value:number, name:string }]
    const [selectedIds, setSelectedIds] = useState([]);       // (number | string)[]

    const [createSelected, setCreateSelected] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [isTagCreating, setIsTagCreating] = useState(false);

    // Keep selectedIds in sync if parent 'tags' changes from outside
    useEffect(() => {
        const ids = (tags ?? []).map(t => t.id);
        setSelectedIds(ids);
    }, [tags]);

    const onCreateTag = useCallback(async () => {
        try {
            setIsTagCreating(true);

            if (!newTagName.trim()) {
                sendAmoErrorNotification("Укажите название тега");
                return;
            }
            const tagName = newTagName.trim();

            const response = await amoApiInstance.post(
                `/api/v4/${entity}/tags`,
                [{ name: tagName }]
            );
            if (response.status !== 200) {
                sendAmoErrorNotification("Произошла ошибка");
                return;
            }

            const createdTagId = response.data._embedded.tags[0].id;

            // update crmTags immutably
            setCrmTags(prev => [
                ...prev,
                { value: createdTagId, name: tagName },
            ]);

            // update selected and external tags immutably
            setSelectedIds(prev => [...prev, createdTagId]);
            setTags(prev => [
                ...(prev ?? []),
                { id: createdTagId, name: tagName },
            ]);

            setCreateSelected(false);
            setNewTagName("");
        } catch (error) {
            console.error(error);
            sendAmoErrorNotification("Произошла ошибка");
        } finally {
            setIsTagCreating(false);
        }
    }, [entity, newTagName, setTags]);

    useEffect(() => {
        const loadTags = async () => {
            if (entity !== "leads" && entity !== "contacts") return;

            const response = await amoApiInstance.get(`/api/v4/${entity}/tags`);
            const loaded = [];
            (response.data?._embedded?.tags ?? []).forEach(tag => {
                loaded.push({ value: tag.id, name: tag.name });
            });

            setCrmTags(loaded);
        };
        loadTags();
    }, [entity]);

    // Map from id to name for fast lookups
    const tagNameById = useMemo(() => {
        const map = new Map();
        crmTags.forEach(t => map.set(t.value, t.name));
        return map;
    }, [crmTags]);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}
        >
            <FormControlLabel
                sx={{ boxSizing: "border-box", m: 0, width: "fit-content", }}
                control={
                    <Checkbox
                        checked={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.checked)}
                        name="attach_tags"
                        sx={{
                            color: "var(--palette-border-default)",
                            "& .MuiSvgIcon-root": { borderRadius: "0.25rem" },
                            "&:hover": { backgroundColor: "transparent" },
                            "&.Mui-checked": { color: "var(--palette-border-primary)" },
                            "&.Mui-checked .MuiSvgIcon-root": {
                                backgroundColor: "transparent",
                                borderRadius: "0.25rem",
                                color: "var(--button_blue)",
                            },
                        }}
                    />
                }
                label="Прикрепить теги"
            />

            {isEnabled && (
                <TagsSettings
                    tags={tags}
                    setTags={setTags}
                    entity={entity}
                    setEntity={setEntity}
                    crmTags={crmTags}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    newTagName={newTagName}
                    setNewTagName={setNewTagName}
                    onCreateTag={onCreateTag}
                    isTagCreating={isTagCreating}
                    createSelected={createSelected}
                    setCreateSelected={setCreateSelected}
                    tagNameById={tagNameById}
                />
            )}
        </Box>
    );
}

function TagsSettings({
    tags,
    setTags,
    entity,
    setEntity,
    crmTags,
    selectedIds,
    setSelectedIds,
    newTagName,
    setNewTagName,
    onCreateTag,
    isTagCreating,
    createSelected,
    setCreateSelected,
    tagNameById,
}) {
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                gap: "1rem",
            }}
        >
            <EntitySelect entity={entity} setEntity={setEntity} />
            <TagsSelect
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                tagsList={crmTags}
                setCreateSelected={setCreateSelected}
                setTags={setTags}
                tagNameById={tagNameById}
            />
            {createSelected && (
                <CreateTag
                    newTagName={newTagName}
                    setNewTagName={setNewTagName}
                    onCreateTag={onCreateTag}
                    newTagCreating={isTagCreating}
                />
            )}
        </Box>
    );
}

function EntitySelect({ entity, setEntity }) {
    return (
        <Box sx={{ boxSizing: "border-box", width: "20%" }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="entity_tag_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Тег для сущности
                </InputLabel>
                <Select
                    labelId="entity_tag_label"
                    id="entity_tag"
                    value={entity}
                    label="Тег для сущности"
                    onChange={(e) => setEntity(e.target.value)}
                    sx={{
                        color: "var(--palette-text-primary)",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-border-default)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "& .MuiSelect-select": {
                            py: "8.5px",
                            minHeight: 0,
                            color: "var(--palette-text-primary)",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "var(--palette-text-primary)",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                background: "var(--palette-background-primary)",
                                border: `1px solid ${"var(--palette-border-default)"}`,
                                "& .MuiMenuItem-root": {
                                    color: "var(--palette-text-primary)",
                                    "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                    "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                    "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value={"leads"}>Сделка</MenuItem>
                    <MenuItem value={"contacts"}>Контакт</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

function TagsSelect({
    selectedIds,
    setSelectedIds,
    tagsList,
    setCreateSelected,
    setTags,
    tagNameById,
}) {
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const incoming = e.target.value;
        const hasCreate = incoming.includes(CREATE_SENTINEL);
        const idsWithoutCreate = incoming.filter(v => v !== CREATE_SENTINEL);

        setSelectedIds(idsWithoutCreate);
        setTags(
            idsWithoutCreate.map(id => ({
                id,
                name: tagNameById.get(id) ?? String(id),
            }))
        );

        setCreateSelected(hasCreate);
        if (hasCreate) setOpen(false);
    };

    return (
        <Box sx={{ width: "30%", boxSizing: "border-box" }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="crm_tags_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Теги amoCRM
                </InputLabel>
                <Select
                    labelId="crm_tags_label"
                    id="crm_tags"
                    multiple
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={selectedIds}
                    label="Теги amoCRM"
                    onChange={handleChange}
                    renderValue={
                        (selected) => (`${plularizeSelectedAmount(selected.length)} ${selected.length} ${plularizeTagsAmount(selected.length)}`)
                    }
                    sx={{
                        color: "var(--palette-text-primary)",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-border-default)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "& .MuiSelect-select": {
                            py: "8.5px",
                            minHeight: 0,
                            color: "var(--palette-text-primary)",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "var(--palette-text-primary)",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                background: "var(--palette-background-primary)",
                                border: `1px solid ${"var(--palette-border-default)"}`,
                                "& .MuiMenuItem-root": {
                                    color: "var(--palette-text-primary)",
                                    "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                    "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                    "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                },
                            },
                        },
                    }}
                >
                    <MenuItem value={CREATE_SENTINEL}>
                        <ListItemText primary="Создать тег" />
                    </MenuItem>
                    {tagsList.map(tag => (
                        <MenuItem value={tag.value} key={tag.value}>
                            <MuiCheckbox
                                checked={selectedIds.indexOf(tag.value) > -1}
                                sx={{
                                    p: "2px 6px",
                                    color: "var(--palette-border-default)",
                                    "&.Mui-checked": { color: "var(--button_blue)" },
                                }}
                            />
                            <ListItemText primary={tag.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

function CreateTag({
    newTagName,
    setNewTagName,
    onCreateTag,
    newTagCreating,
}) {
    const isCreateDisabled = !newTagName.trim();
    const isButtonDisabled = newTagCreating || isCreateDisabled;

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                flex: 1,
                display: "flex",
                gap: "1rem",
            }}
        >
            <FormControl fullWidth size="small">
                <TextField
                    label="Название нового тега"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "text" }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "var(--palette-text-primary)",
                            "& fieldset": { borderColor: "var(--palette-border-default)" },
                            "&:hover fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                            "&.Mui-focused fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "var(--palette-border-default)",
                            "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputBase-input": { color: "var(--palette-text-primary)" },
                    }}
                />
            </FormControl>
            <Button
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "var(--button_blue)",
                    cursor: "pointer",
                    p: "0 1.5rem",
                    m: 0,
                    minWidth: 0,
                    color: isButtonDisabled
                        ? "var(--palette-text-secondary-dark-green)"
                        : "var(--palette-text-primary)",
                }}
                disabled={isButtonDisabled}
                title="Создать тег amoCRM"
                onClick={onCreateTag}
            >
                <span>{newTagCreating ? "Создание..." : "Создать"}</span>
            </Button>
        </Box>
    );
}


const plularizeSelectedAmount = (amount) => {
    if (amount % 10 === 1) {
        return "Выбран";
    } else {
        return "Выбрано";
    }    
}


const plularizeTagsAmount = (amount) => {
    if (amount % 10 === 1) {
        return "тег";
    } else if (amount % 10 === 2 || amount % 10 === 3 || amount % 10 === 4) {
        return "тега";
    } else {
        return "тегов";
    }
}