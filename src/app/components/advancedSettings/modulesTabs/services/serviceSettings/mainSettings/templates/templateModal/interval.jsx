import React, { useState } from "react";
import { Box, Slider, Typography } from "@mui/material";

export default function IntervalSlider({interval, setInterval}) {
    const handleChange = (event, newValue) => {
        setInterval(newValue);
    };

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
                width: "100%",
                height: "100%",
                position: "relative",
                border: "1px solid var(--palette-border-default)",
                borderRadius: "4px",
                p: "0.25rem 1rem"
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    position: "absolute",
                    top: "-8px",
                    left: "12px",
                    px: "6px",
                    backgroundColor: "var(--palette-background-primary)",
                    color: "var(--palette-border-default)",
                    fontSize: "0.75rem",
                    lineHeight: 1,
                    zIndex: 1,
                }}
            >
                Интервал отправки сообщений
            </Typography>

            <Box 
                sx={{ 
                    width: "100%", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "1rem",
                    boxSizing: "border-box",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.8125rem",
                        lineHeight: 1,
                    }}
                >
                    {interval} мин
                </Typography>
                <Slider
                    value={interval}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={60}
                    sx={{
                        zIndex: 1200,
                        color: "var(--button_blue)", // main color 
                        "& .MuiSlider-thumb": {
                            backgroundColor: "var(--button_blue)", // color of circle
                        },
                        "& .MuiSlider-track": {
                            backgroundColor: "var(--button_blue)", // active line
                        },
                        width: "auto",
                        flex: 1,
                    }}
                />
            </Box>
        </Box>
    );
}
