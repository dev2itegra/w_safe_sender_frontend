import React from "react";
import { Box, Button } from "@mui/material";


export default function AddServiceButton({disabled, onClick}) {
    return (
        <Box
            sx={{

            }}
        >
            <Button
                sx={{
                    border: "none",
                    background: "var(--button_blue)",
                    borderRadius: "4px",
                    color: "var(--palette-text-default)",
                    letterSpacing: "0.01071em",
                }}
                disabled={disabled}
                onClick={onClick}
            >
                Новый сервис
            </Button>
        </Box>
    )
    
}