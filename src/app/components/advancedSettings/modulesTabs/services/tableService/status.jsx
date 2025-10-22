import React from "react";
import { Box } from "@mui/material";

export default function ServiceStatus({ isTokenLinked, subscriptionEndDate, isTrialSubscription }) {
    const {color, text} = getSubscriptionStatus(isTokenLinked, subscriptionEndDate, isTrialSubscription);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    borderRadius: "4px",
                    border: `1px solid ${color}`,
                    width: "100%",
                    textAlign: "center",
                    p: "4px",
                    boxSizing: "border-box",
                    color: color,
                }}
            >
                {text}
            </Box>
        </Box>
    );
}

function getSubscriptionStatus(isTokenLinked, endDate, isTrial) {
    if (!isTokenLinked) {
        return {
            color: "var(--color-fiery-orange)",
            text: "Не указан токен"
        };
    }
    
    const now = new Date();
    const end = new Date(endDate);

    const formatted = end.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const isExpired = end < now;

    if (isTrial && isExpired) {
        return {
            color: "var(--color-salmon)",
            text: `Пробный период истёк ${formatted}`,
        };
    }

    if (isTrial && !isExpired) {
        return {
            color: "#66CC33",
            text: `Пробный период до ${formatted}`,
        };
    }

    if (!isTrial && isExpired) {
        return {
            color: "var(--color-salmon)",
            text: `Срок подписки истёк ${formatted}`,
        };
    }

    return {
        color: "#66CC33",
        text: `Подписка активирована до ${formatted}`,
    };  
}