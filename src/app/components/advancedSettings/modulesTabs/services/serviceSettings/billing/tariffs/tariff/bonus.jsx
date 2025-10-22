import React from "react";
import { Box, Typography } from "@mui/material";
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';

export default function Bonus({ value }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                mb: "20px",
                p: "3px 6px",
                gap: "0.5rem",
            }}
        >
            <Typography
                component={"span"}
                sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                }}
            >
                {value}
            </Typography>
            <RedeemOutlinedIcon fontSize="1rem" sx={{color: "var(--button_blue)"}} />
        </Box>
    )
}