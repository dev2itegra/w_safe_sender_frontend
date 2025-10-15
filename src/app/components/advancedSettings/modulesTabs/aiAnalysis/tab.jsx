import React, { useState, useEffect, useCallback, } from "react";
import { Box } from "@mui/material";

import TabHeader from "./header";
import PatternsList from "./patternsList";


export function AIAnalysisTab({ }) {
    const patterns = [
        {
            id: 1,
            name: "Шаблон номер 1",
            state: true,
            prompt: {
                "text": "Промпт 1",
                "answer_type": "bool",
                "ai_model": "s2t",
                answer_type_settings: {

                }
            },
            crm_field: {
                state: true,
                field_id: 1071821,
                entity: "leads"
            },
            run_salesbot: {
                state: true,
                id: 12369,
            },
            tags: {
                state: true,
                list: [],
                entity: "leads",
            }
        },
    ];

    const availableModels = [
        {
            value: "s2t",
            name: "Speech2Text_AI",
            description: "Стандартная модель Speech2Text для ИИ анализа",
        },
    ]

    const availableAnswerTypes = [
        {
            value: "bool",
            name: "Да/Нет",
            crm_field_type: "checkbox",
            description: `Отвечает "Да" или "Нет"`
        },
        {
            value: "string",
            name: "Текст",
            crm_field_type: "text",
            description: `Отвечает в свободной форме`
        },
        {
            value: "int",
            name: "Целое число",
            crm_field_type: "numeric",
            description: `Возвращает в ответ целое число в указанном диапазоне`,
        },
        {
            value: "float",
            name: "Дробное число",
            crm_field_type: "numeric",
            description: `Возвращает в ответ дробное число в указанном диапазоне`,
        },
        {
            value: "enum",
            name: "Выбор из предложенного",
            crm_field_type: "text",
            description: `Выбирает один из полученных вариантов ответа`,
        },
    ]


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
            <PatternsList
                patterns={patterns} 
                availableModels={availableModels}
                availableAnswerTypes={availableAnswerTypes}    
            />
        </Box>
    )
}