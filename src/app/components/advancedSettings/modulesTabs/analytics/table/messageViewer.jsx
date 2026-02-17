import React, { useMemo } from 'react';
import { Typography, Tooltip, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'


function MessageViewer({ text }) {
    return (
        <Tooltip
            title={text}
            placement="top-start"
            slotProps={{
                tooltip: {
                    sx: {
                        fontSize: "0.75rem",
                        backgroundColor: "var(--palette-background-default)",
                        color: "var(--palette-text-primary)",
                        p: "6px 8px",
                        borderRadius: "4px",
                        maxWidth: "500px",
                        fontWeight: 400,
                        letterSpacing: "0.025rem",
                        lineHeight: 1.5,
                        border: "1px solid var(--palette-border-primary)",
                    },
                },
            }}
        >
            <OpenInNewIcon 
                sx={{ 
                    fontSize: "1rem",
                    color: "var(--palette-text-secondary-light)",
                    verticalAlign: "middle",
                    lineHeight: 0,
                    cursor: "help",
                    "&:hover": {
                        color: "var(--button_blue)",
                    }
                }} 
            />
        </Tooltip>
    );
}

export default MessageViewer;