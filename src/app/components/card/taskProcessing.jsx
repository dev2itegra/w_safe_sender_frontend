import React, { useState, useEffect, useCallback, useRef } from "react";

import {
    Button,
    CircularProgress,
    Modal,
    Box,
    Typography,
    ThemeProvider,
} from "@mui/material";

import { useWebSocket } from "../../services/websocket/useWebSocket";
import { apiWSOrigin } from "../../config";

export function TaskProcessing({ setIsTaskProcessing, taskId }) {
    const wsUrl = `${apiWSOrigin}/ws?task_id=${encodeURIComponent(taskId)}`;
    
    useEffect(() => {
        
    }, []);
    
    const onMessage = useCallback((data) => {
        if (data.type === "taskDone") {
            setIsTaskProcessing(false);
            return;

        } else if (data.type === "welcome") {

        } else if (data.type === "pong") {

        }
    }, []);

    const { ready, send } = useWebSocket(wsUrl, { onMessage });


    return <>
        <Box 
            sx={{
                alignSelf: "center",
                padding: "1rem 0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                width: "100%",
            }}
        >
            <Typography>{ready? "Звонок транскрибируется" : "Подключение..."}</Typography>
            <CircularProgress size="15px" style={{ marginLeft: 8 }}/>
        </Box>
    </>
}