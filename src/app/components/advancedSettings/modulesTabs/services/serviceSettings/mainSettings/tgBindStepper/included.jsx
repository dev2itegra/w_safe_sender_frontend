import React from 'react';
import { Box, Typography, Button } from '@mui/material';


function IncludedTelegram(
    {
        phoneNumber,
        onUnlink,
    }
) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1.5rem",
                alignItems: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    letterSpacing: "0.05rem",
                    color: "var(--palette-text-secondary-light)",
                }}
            >
                {`Телеграм аккаунт ${phoneNumber} привязан`}
            </Typography>
            <Button
                disableRipple
                sx={{
                    background: "transparent",
                    p: 0,
                    color: "var(--button_blue)",
                }}
                onClick={onUnlink}
            >
                Отвязать
            </Button>
        </Box>
    );
}

export default IncludedTelegram;