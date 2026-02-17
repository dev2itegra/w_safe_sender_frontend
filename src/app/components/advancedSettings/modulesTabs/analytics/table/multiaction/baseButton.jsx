import React from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';


function BaseButton({ icon, text, onClick, disabled = false, isLoading = false}) {
    return ( 
        <Button
            variant="text"
            sx={{
                color: "var(--palette-text-secondary-light)",
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                p: "2px 0",
                "&.Mui-disabled": {
                    color: "var(--palette-text-secondary-light)",
                    opacity: 0.5,
                },
                "&.MuiButton-root:hover": {
                    background: "transparent",
                }
            }}
            disableRipple
            disableFocusRipple
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {icon}
            <Typography 
                sx={{ 
                    fontSize: "0.8125rem", 
                    lineHeight: 1.5, 
                    textTransform: "lowercase",
                }}
            >
                {text}
            </Typography>
            {
                isLoading &&
                <CircularProgress size="1rem" />
            }
        </Button>
    );  
}

export default BaseButton;