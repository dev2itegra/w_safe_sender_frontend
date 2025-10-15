import React, { useState, useEffect, useCallback, } from "react";
import { Box } from "@mui/material";

import TabHeader from "./header";
import TemplatesList from "./templatesList/templatesList";


export default function Templates({ }) {
    const templates = [
        {
            id: 1,
            name: "Шаблон номер 1",
            channel: {
                name: "Telegram",
                value: "tg",
            },
            interval: 5,
            send_time: {
                weekdays: [1, 2, 3, 4, 5, 6, 7],
                time_from: "10:00",
                time_till: "20:00",
            },
            message_text: "Привет, это сообщение шаблона!",
        },
        {
            id: 2,
            name: "Шаблон номер 2",
            channel: {
                name: "WhatsApp",
                value: "wp",
            },
            interval: 15,
            send_time: {
                weekdays: [1, 2, 3, 4, 5, 6, 7],
                time_from: "10:00",
                time_till: "20:00",
            },
            message_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.!",
        },
    ];

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <TabHeader />
            <TemplatesList
                templates={templates} 
            />
        </Box>
    )
}