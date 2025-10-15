import React from "react";
import { Box } from "@mui/material";

import { LoginButton } from "./loginButton";
import { Tariff } from "./tariff";


export function Account({ tariffication }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Tariff 
                available={tariffication?.available}
                used={tariffication?.used} 
                balance={tariffication?.balance} 
            />
            <LoginButton />
        </Box>
    )
}

