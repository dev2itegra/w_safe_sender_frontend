import { Box } from "@mui/material";
import React from "react";


export default function TableCell({ children, }) {
    return (
        <Box
            sx={{
                display: "flex",
                p: "0.75rem 1rem",
                boxSizing: "border-box",
                background: "var(--palette-background-primary)",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: "0.8125rem",
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
            }}
        >
            {children}
        </Box>
    )
}