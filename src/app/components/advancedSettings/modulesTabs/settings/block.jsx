import React from "react";
import { Box, Typography } from "@mui/material";


export function Block({ blockName, children, sx, ...rest }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                padding: "1rem",
                boxSizing: "border-box",
                backgroundColor: "var(--palette-background-primary)",
                borderRadius: "0.2rem",
                ...sx
            }}
            {...rest}
        >
            {blockName? <Typography
                sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: "0.05rem",
                }}
            >
                {blockName}
            </Typography>: <></>}

            <>{children}</>
        </Box>
    )
}