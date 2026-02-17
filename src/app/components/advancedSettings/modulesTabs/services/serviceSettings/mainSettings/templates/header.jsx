import React from "react";
import { Box, Button, Typography } from "@mui/material";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

import { CreateTemplateButton } from "./createTemplateButton";


export default function TabHeader({ onCreateTemplate, serviceChannels, serviceType }) {
    return (
        <Box
            sx={{
                background: "var(--palette-background-primary)",
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                p: "1rem",
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
            <CreateTemplateButton 
                onCreateTemplate={onCreateTemplate} 
                serviceChannels={serviceChannels} 
                serviceType={serviceType}
            />
        </Box>
    );
}


function TabName({}) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}
        >
            <MessageOutlinedIcon 
                sx={{
                    fontSize: "1.25rem", 
                    color: "var(--button_blue)",
                }}
            />
            <Typography
                sx={{
                    lineHeight: 1.1,
                    fontSize: "1.1rem",
                    fontWeight: 500,
                }}
            >
                Шаблоны рассылки
            </Typography>
        </Box>
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