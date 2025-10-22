import React from "react";
import { Box, Typography } from "@mui/material";


export default function TarifficationInfo() {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                borderRadius: "10px",
                border: "1px solid var(--palette-border-default)",
                background: "var(--palette-background-default)",
                p: "1rem",
                color: "var(--palette-text-secondary-light)",
            }}
        >
            <Typography
                sx={{
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    lineHeight: 1.57,
                    letterSpacing: "0.00714em",
                }}
            >
                Стоимость подписки указана за 1 сервис            
            </Typography>
        </Box>
    )
}