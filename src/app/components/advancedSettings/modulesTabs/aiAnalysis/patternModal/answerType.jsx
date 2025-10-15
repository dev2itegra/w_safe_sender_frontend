import React, { useCallback, useEffect, useState } from "react";
import { 
    Button, 
    Box, 
    FormControl, 
    TextField, 
    Select, 
    MenuItem, 
    InputLabel, 
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Hint from "../../../../hint";



export function AnswerType({ answerType, setAnswerType, availableAnswerTypes }) {
    const getAnswerTypeData = useCallback((type) => {
        return availableAnswerTypes.find(t => t.value === type); 
    }, [availableAnswerTypes])


    return (
        <Box 
            sx={{ 
                boxSizing: "border-box",
            }}
        >
            <FormControl fullWidth size="small">
                <InputLabel
                    id="answer_type_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Тип ответа
                </InputLabel>
                <Select
                    labelId="answer_type_label"
                    id="answer_type"
                    value={answerType}
                    label="Тип ответа"
                    onChange={(e) => setAnswerType(e.target.value)}
                    renderValue={
                        (selected) => {
                            const data = getAnswerTypeData(selected); 
                            return <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    boxSizing: "border-box",
                                    pr: "0.5rem",
                                }}
                            >
                                <span style={{lineHeight: 1}}>{data.name}</span> 
                                <Hint 
                                    title={"ИИ модель предоставит ответ на поставленный вопрос в указанном формате"}
                                    ariaLabel={"Подсказка о типе ответа"}
                                />
                            </Box>
                        }
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
                    MenuProps={
                        {
                            PaperProps: {
                                sx: {
                                    background: "var(--palette-background-primary)",
                                    border: `1px solid ${"var(--palette-border-primary)"}`,
                                    "& .MuiMenuItem-root": {
                                        color: "var(--palette-text-primary)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        boxSizing: "border-box",
                                        "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                        "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                        "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                    },
                                },
                            }
                        }
                    }
                >
                    {availableAnswerTypes.map((type, index) => {
                        return <MenuItem value={type.value} key={index} >
                            <span style={{lineHeight: 1}}>{type.name}</span>
                            {type.description && 
                            <Hint 
                                title={type.description}
                                ariaLabel={"Подсказка с описанием типа ответа"}
                            />
                            }
                        </MenuItem>
                    })}
                </Select>
            </FormControl>
        </Box>
    )
}


export function AnswerTypeSettings({answerType, answerTypeSettings, setAnswerTypeSettings}) {    
    return (
        <Box
            sx={{
                boxSizing: "border-box",
            }}
        >
            {
                (answerType === "float" || answerType === "int") && 
                <RangeSettings 
                    a={answerTypeSettings?.minimum_value || 0} 
                    b={answerTypeSettings?.maximum_value || 100} 
                    onUpdate={setAnswerTypeSettings}
                />
            }
            {
                answerType === "enum" && 
                <EnumSettings 
                    selectedValues={answerTypeSettings.values || []}
                    onUpdate={setAnswerTypeSettings}
                />
            }
        </Box>
    )
}


function RangeSettings({a, b, onUpdate}) {
    const [fromValue, setFromValue] = useState(a);
    const [toValue, setToValue] = useState(b);

    useEffect(
        () => {
            onUpdate(
                {
                    minimum_value: fromValue,
                    maximum_value: toValue,
                }
            )
        }, [fromValue, toValue, onUpdate]
    );

    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                gap: "0.5rem",
            }}
        >
            <FormControl fullWidth size="small">
                <TextField
                    label="От"
                    value={fromValue}
                    onChange={(e) => {setFromValue(e.target.value)}}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
            <FormControl fullWidth size="small">
                <TextField
                    label="До"
                    value={toValue}
                    onChange={(e) => {setToValue(e.target.value)}}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
        </Box>
    )
}


export function EnumSettings({ selectedValues, onUpdate }) {
    const [values, setValues] = useState(selectedValues || []);
    const [newValue, setNewValue] = useState("");
    const [open, setOpen] = useState(false);

    const isInvalid = values.length < 2;

    useEffect(() => {
        onUpdate({ values: [...values] });
    }, [values, onUpdate]);

    const handleAdd = () => {
        const trimmed = newValue.trim();
        if (trimmed && !values.includes(trimmed)) {
            setValues(prev => [...prev, trimmed]);
            setNewValue("");
        }
    };

    const handleDelete = (value) => {
        setValues(prev => prev.filter(v => v !== value));
    };

    return (
        <Box sx={{ width: "100%", display: "flex", gap: "0.5rem", color: "var(--palette-text-primary)" }}>
            <TextField
                size="small"
                label="Варианты ответа на выбор"
                value={`${plularizeSelectedAmount(values.length)} ${values.length} ${plularizeElementsAmount(values.length)}`}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <Box sx={{ display: "flex", gap: "0", alignItems: "center" }}>
                            {isInvalid && (
                                <InputAdornment position="end">
                                    <Hint
                                        title="Необходимо указать минимум 2 варианта"
                                        ariaLabel="Подсказка о неправильном количестве выбранных элементов"
                                    />
                                </InputAdornment>
                            )}
                            <InputAdornment position="end" sx={{ m: 0 }}>
                                <IconButton
                                    aria-label="edit"
                                    onClick={() => setOpen(true)}
                                    edge="end"
                                    sx={{
                                        color: "var(--palette-text-primary)",
                                        "&:hover": { 
                                            color: "var(--palette-text-primary)", 
                                            background: "transparent",
                                        },
                                    }}
                                >
                                    <ArrowDropDownIcon sx={{ fontSize: "1.5rem", mr: "-2.5px" }} />
                                </IconButton>
                            </InputAdornment>
                        </Box>
                    ),
                }}
                sx={{
                    flex: 1,
                    "& .MuiInputLabel-root": {
                        color: "var(--palette-border-default)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--palette-accent, #1976d2)",
                    },
                    "& .MuiInputBase-input": { color: "var(--palette-text-primary)" },
                    "&::placeholder": {
                        color: "var(--palette-border-default)",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: isInvalid
                            ? "var(--palette-error, #d32f2f)"
                            : "var(--palette-border-default)",
                    },
                    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: isInvalid
                            ? "var(--palette-error, #d32f2f)"
                            : "var(--palette-accent, #1976d2)",
                    },
                }}
            />

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: 0,
                        border: "1px solid var(--palette-border-default)",
                        background: "var(--palette-background-primary)",
                        color: "var(--palette-text-primary)",
                    },
                }}
            >
                <Box
                    sx={{
                        p: "0px 10px",
                        display: "flex",
                        alignItems: "center",
                        boxSizing: "border-box",
                        width: "100%",
                        color: "var(--palette-text-primary)",
                    }}
                >
                    <DialogTitle sx={{ fontSize: "1rem", p: 0, mr: "auto", color: "var(--palette-text-primary)" }}>
                        Редактировать варианты ответа
                    </DialogTitle>
                    <Button
                        onClick={() => setOpen(false)}
                        sx={{
                            p: 0,
                            fontSize: "1.5rem",
                            minWidth: 0,
                            color: "var(--button_blue)",
                            "&:hover": { backgroundColor: "transparent", opacity: 0.75 },
                        }}
                    >
                        &#10006;
                    </Button>
                </Box>

                <DialogContent
                    dividers
                    sx={{ p: "8px 10px", color: "var(--palette-text-primary)" }}
                >
                    {isInvalid && (
                        <Alert
                            severity="warning"
                            sx={{
                                mb: "0.75rem",
                                border: "1px solid var(--palette-border-default)",
                                background: "transparent",
                                color: "var(--palette-text-primary)",
                                "& .MuiAlert-icon": { color: "var(--color-golden-tainoi)" },
                            }}
                        >
                            Необходимо указать минимум 2 элемента
                        </Alert>
                    )}

                    <Box sx={{ display: "flex", gap: "0.5rem", mb: "1rem" }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Новый вариант ответа"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            sx={{
                                "& .MuiInputBase-input": { 
                                    color: "var(--palette-text-primary)",
                                    "&::placeholder": {
                                        color: "var(--palette-border-default)",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "var(--palette-border-default)",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "var(--palette-accent, #1976d2)",
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "var(--palette-border-default)",
                                },
                                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "var(--palette-accent, #1976d2)",
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            disabled={!newValue.trim()}
                            sx={{
                                minWidth: "40px",
                                background: "var(--button_blue)",
                                color: "var(--palette-text-primary)",
                                "&:hover": { opacity: 0.85, background: "var(--button_blue)" },
                                "&.Mui-disabled": {
                                    color: "var(--palette-text-primary)",
                                    background: "var(--palette-text-secondary-dark-green)",
                                },
                            }}
                        >
                            {/* <AddIcon fontSize="small" /> */}
                            Добавить
                        </Button>
                    </Box>

                    <List dense sx={{ color: "var(--palette-text-primary)" }}>
                        {values.map((value, idx) => (
                            <ListItem
                                key={idx}
                                sx={{
                                    border: "1px solid var(--palette-border-default)",
                                    borderRadius: "4px",
                                    mb: "4px",
                                    py: 0.5,
                                    px: 1,
                                    color: "var(--palette-text-primary)",
                                }}
                            >
                                <ListItemText
                                    primary={value}
                                    sx={{ color: "var(--palette-text-primary)" }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => handleDelete(value)}
                                        sx={{
                                            color: "var(--palette-border-default)",
                                            "&:hover": { color: "red" },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
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


const plularizeElementsAmount = (amount) => {
    if (amount % 10 === 1) {
        return "элемент";
    } else if (amount % 10 === 2 || amount % 10 === 3 || amount % 10 === 4) {
        return "элемента";
    } else {
        return "элементов";
    }
}


