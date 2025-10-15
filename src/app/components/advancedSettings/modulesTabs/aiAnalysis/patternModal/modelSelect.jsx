import React, { useCallback, useState } from "react";
import { Modal, Button, Box, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Divider, } from "@mui/material";

import Hint from "../../../../hint";


export default function ModelSelect({ AIModel, setAIModel, availableModels }) {
    const getModelData = useCallback((model) => {
        return availableModels.find(m => m.value === model); 
    }, [availableModels])
    
    
    return (
        <Box 
            sx={{ 
                boxSizing: "border-box",
            }}
        >
            <FormControl fullWidth size="small">
                <InputLabel
                    id="ai_model_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Модель AI
                </InputLabel>
                <Select
                    labelId="ai_model_label"
                    id="ai_model"
                    value={AIModel}
                    label="Модель AI"
                    onChange={(e) => setAIModel(e.target.value)}
                    renderValue={
                        (selected) => {
                            const data = getModelData(selected); 
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
                                    title={data.description}
                                    ariaLabel={"Подсказка о выбранной модели"}
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
                    {availableModels.map((model, index) => {
                        return <MenuItem value={model.value} key={index} >
                            <span style={{lineHeight: 1}}>{model.name}</span>
                            {model.description && 
                            <Hint 
                                title={model.description}
                                ariaLabel={"Подсказка с описанием модели"}
                            />
                            }
                        </MenuItem>
                    })}
                </Select>
            </FormControl>
        </Box>
    )
}
