import React, { useCallback, useState } from "react";
import { Box, Button } from "@mui/material";

import { baseApiInstance } from "../../../../../services/requests/axios.instance";
import { sendAmoErrorNotification } from "../../../../../services/amoNotification/sendNotification";


export function LoginButton() {
    const [isProcessing, setIsProcessing] = useState(false);

    const onClick = useCallback(
        async () => {
            setIsProcessing(true);
            try {
                const response = await baseApiInstance.get("/widget/auth-link");
                const auth_link = response.data.auth_link;
                window.open(auth_link, "_blank");
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Не удалось получить ссылку");
            } finally {
                setIsProcessing(false);
            }
        },
        []
    );

    return (
        <Button
            sx={{
                background: "transparent",
                color: "var(--button_blue)",
                width: "fit-content",
                transition: "all 0.1s ease",
                p: "0",
                boxSizing: "border-box",
                borderBottom: "1px solid currentColor",
                borderRadius: 0,
                "&:hover" : {
                    opacity: 0.75,
                    background: "transparent",
                },
                "&:disabled" : {
                    opacity: 0.75,
                    background: "transparent",
                    color: "var(--button_blue)",
                }
            }}
            onClick={onClick}
            disabled={isProcessing}
        >
            {isProcessing? "Загрузка..." : "Перейти в аккаунт Speech2text"}
        </Button>
    )
}