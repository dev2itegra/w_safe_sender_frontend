import React from "react";
import { Button } from "@mui/material";


export default function ProcessServiceCreatingButton({disabled, onClick}) {
    return (
        <Button
            sx={{
                border: "none",
                background: "var(--button_blue)",
                borderRadius: "4px",
                color: "var(--palette-text-default)",
                p: "3px 9px",
                letterSpacing: "0.01071em",
                ml: "auto",
            }}
            disabled={disabled}
            onClick={onClick}
        >
            Подключить
        </Button>
    )
    
}