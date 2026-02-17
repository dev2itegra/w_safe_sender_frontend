import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import TokenIcon from '@mui/icons-material/Token';


export default function ApiKey({ prevApiKey, onSetApiKey }) {
    const [apiKey, setApiKey] = useState(prevApiKey);
    
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <TokenIcon sx={{fontSize: "1.25rem", color: "var(--button_blue)"}} />
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: "1.25rem",
                        }}
                    >
                        API ключ WAZZUP
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: "1rem",
                        color: "var(--palette-text-secondary-dark-green)",
                        lineHeight: 1,
                    }}
                >
                    Аккаунт Wazzup → вкладка Интеграция с СРМ → дополнительно → Ключ API
                </Typography>   
            </Box>
            <TextField
                id="service_api_key"
                variant="outlined"
                fullWidth
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onBlur={(e) => onSetApiKey(apiKey)}
                placeholder={!!apiKey?.length? "" : "API ключ Wazzup"}
                slotProps={{
                    input: {
                        sx: {
                            "&& .MuiOutlinedInput-input": {
                                color: "var(--palette-text-primary)",
                                fontSize: "1rem",
                                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                            },
                            "&& .MuiOutlinedInput-input::placeholder": {
                                color: "var(--palette-text-primary)",
                                opacity: 0.6,
                            },
                            "&& input:-webkit-autofill": {
                                WebkitTextFillColor: "var(--palette-text-primary)",
                                WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--palette-border-default)",
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--button_blue)",
                            },

                            // focused
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--button_blue)",
                            },
                        },
                    },
                }}
            />



        </Box>
    )   
}


