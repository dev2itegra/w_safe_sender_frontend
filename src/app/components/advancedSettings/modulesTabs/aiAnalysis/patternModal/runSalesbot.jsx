import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Box, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Divider, FormControlLabel, Checkbox  } from "@mui/material";
import { amoApiInstance } from "../../../../../services/requests/amoAPI";
import Hint from "../../../../hint";



export default function RunSalesbot(
    {
        runSalesbot,
        setRunSalesbot,
        salesbotId,
        setSalesbotId,        
    }
) {
    const [salesbots, setSalesbots] = useState([]);

    useEffect(() => {
        const loadSalesbots = async () => {
            try {
                const response = await amoApiInstance.get("/api/v4/bots");
                const list = [];
                response.data?._embedded?.items.forEach(bot => {
                    list.push(
                        {
                            id: bot.id,
                            name: bot.name, 
                        }
                    )
                }
                );
                setSalesbots(list);
            } catch (error) {
                console.error(error);
            }
        }
        loadSalesbots()

    }, [])


    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: "0.5rem",
                }}
            >
                <FormControlLabel
                    disabled={salesbots.length === 0}
                    sx={{
                        boxSizing: "border-box",
                        m: 0,
                        width: "fit-content",
                        "& .MuiFormControlLabel-label": {
                            color: "var(--palette-text-primary)",
                        },
                        "& .MuiFormControlLabel-label.Mui-disabled": {
                            color: "var(--palette-text-secondary-dark-green) !important",
                        },
                    }}
                    control={
                        <Checkbox
                            checked={runSalesbot}
                            onChange={(e) => setRunSalesbot(e.target.checked)}
                            name={`run_sales_bot`}
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
                                "&.Mui-disabled": {
                                    color: "var(--palette-border-default) !important",
                                    opacity: 0.6,
                                },
                            }}
                        />
                    }
                    label={`Запустить Salesbot после проведения анализа`}
                />
                {salesbots.length === 0 &&
                <Hint 
                    title={
                        <>
                            Нет доступных сейлзботов
                        </>
                    }
                    ariaLabel={"Подсказка об отсутсвии сейлзботов"}
                />}
            </Box>
            {runSalesbot && salesbots.length > 0 && <FormControl size="small" sx={{width: "30%"}}>
                <InputLabel
                    id="run_salesbot_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Salesbot
                </InputLabel>
                <Select
                    labelId="run_salesbot_label"
                    id="run_salesbot"
                    value={salesbotId}
                    label="Salesbot"
                    disabled={salesbots.length === 0}
                    onChange={(e) => setSalesbotId(e.target.value)}
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
                        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-border-default) !important",
                        },
                        "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-border-default) !important",
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
                                        "&.Mui-selected": { bgcolor: "rgba(25,118,210,0.08)" },
                                        "&.Mui-selected.Mui-focusVisible": { bgcolor: "rgba(25,118,210,0.12)" },
                                        "&:hover": { bgcolor: "rgba(25,118,210,0.06)" },
                                    },
                                },
                            }
                        }
                    }
                >
                    {
                        salesbots.map((bot, index) => {
                            return <MenuItem value={bot.id} key={index}>{bot.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>}    
        </Box>
    )
}