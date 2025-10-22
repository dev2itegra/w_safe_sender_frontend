import React from "react";
import { Box } from "@mui/material";


export default function Block({ children, sx }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                p: "1.25rem",
                background: "var(--palette-background-primary)",
                ...sx
            }}
        >
            {children}
        </Box>
    )   
}