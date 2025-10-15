import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { CreateTemplateButton } from "./createTemplate";


export default function TabHeader({}) {
    return (
        <Box
            sx={{
                background: "var(--palette-background-primary)",
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                padding: "1rem",
                boxSizing: "border-box",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
                <TabName />
                <TemplatesHint />
            </Box>
            <CreateTemplateButton />
        </Box>
    );
}


function TabName({}) {
    return (
        <Typography
            sx={{
                lineHeight: 1.1,
                fontSize: "1.1rem",
                fontWeight: 500,
            }}
        >
            Шаблоны рассылки
        </Typography>
    )
}


function TemplatesHint({}) {
    return (
        <Typography
            sx={{
                lineHeight: 1,
                fontSize: "1rem",
                color: "var(--palette-text-secondary-dark-green)",
            }}
        >
            Настройка шаблонов для интервальной рассылки сообщений
        </Typography>
    );
}