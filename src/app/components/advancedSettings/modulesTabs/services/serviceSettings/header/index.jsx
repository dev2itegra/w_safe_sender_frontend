import React from "react";
import { Box } from "@mui/material";
import ReturnBackButton from "./backButton";
import ServiceName from "./serviceName";


export default function ServiceSettingsHeader({ serviceName, onMoveBack, onUpdateServiceName }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
                p: "1.25rem",
                background: "var(--palette-background-primary)",
            }}
        >
            <ReturnBackButton   
                onMoveBack={onMoveBack}
            />
            <ServiceName
                serviceName={serviceName}
                onUpdateServiceName={onUpdateServiceName}
            />
        </Box>
    )
}