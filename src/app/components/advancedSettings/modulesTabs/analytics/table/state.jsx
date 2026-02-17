import React from 'react';
import { Typography, Tooltip, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

const statesColors = {
    error: '#F26E6E',
    queued: '#e8c72f',
    sent: '#53e33a',
    cancelled: 'var(--palette-text-secondary-light)',
};

const statesTexts = {
    error: 'Ошибка',
    sent: 'Отправлено',
    queued: 'В очереди',
    cancelled: "Отменено",
};

function State({ state, error = '' }) {
    const color = statesColors[state] || 'var(--palette-text-secondary-light)';
    const text = statesTexts[state] || state;

    const content = (
        <Typography
            component="span"
            sx={{
                color,
                boxSizing: 'border-box',
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                borderRadius: '3px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: error && state === 'error' ? 'help' : 'default',
                verticalAlign: 'middle',
            }}
        >
            {text}
        </Typography>
    );

    if (error && state === 'error') {
        return (
            <Tooltip
                title={error}
                placement="top"
                arrow
                disableInteractive
                disableFocusListener
                disableTouchListener
                slotProps={{
                    tooltip: {
                        sx: {
                            fontSize: '0.75rem',
                            backgroundColor: 'var(--palette-background-default)',
                            color: 'var(--palette-text-primary)',
                            p: '6px 8px',
                            borderRadius: '4px',
                        },
                    },
                    arrow: {
                        sx: { color: 'var(--palette-background-default)' },
                    },
                    popper: { disablePortal: true }
                }}
            >
                <span>
                    {content}
                    <HelpIcon
                        aria-hidden
                        focusable="false"
                        sx={{
                            fontSize: '1rem',
                            color,
                            verticalAlign: 'middle',
                            lineHeight: 0,
                            pl: '0.35rem',
                        }}
                    />
                </span>
            </Tooltip>
        );
    }

    return content;
}

export default State;
