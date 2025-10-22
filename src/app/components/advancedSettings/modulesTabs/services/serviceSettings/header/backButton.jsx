import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


export default function ReturnBackButton({ onMoveBack }) {
    return (
        <Box
            sx={{
                alignSelf: "flex-start",
            }}
        >
            <Button
                sx={{
                    p: 0,
                    color: "var(--palette-text-secondary-dark-green)",
                    backgroundColor: "transparent",
                }}
                onClick={onMoveBack}
            >
                <KeyboardBackspaceIcon 
                    sx={{
                        fontSize: "1rem",
                        mr: "0.35rem",
                    }}
                />
                <Typography
                    sx={{
                        fontSize: "0.8125rem",
                    }}
                >
                    Назад
                </Typography>
            </Button>
        </Box>
    )
}