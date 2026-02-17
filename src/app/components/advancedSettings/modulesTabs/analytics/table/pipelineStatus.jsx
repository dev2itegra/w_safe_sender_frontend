import React, { useMemo } from 'react';
import { Typography } from '@mui/material';


function PipelineStatus({ statusName, pipelineName, color}) {

    const text = useMemo(() => {
        return (pipelineName? `${pipelineName}: `: "") + statusName;
    }, [statusName, pipelineName]);
    
    return ( 
        <Typography
            component={"span"}
            sx={{
                color: "var(--color-onyx)",
                background: color,
                boxSizing: "border-box",
                p: "3px 6px",
                fontSize: "0.7125rem",
                borderRadius: "3px",
                lineHeight: 1.3,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textSverflow: "ellipsis",
            }}
        >
            {text}
        </Typography>
    );
}

export default PipelineStatus;