import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { sendAmoErrorNotification } from "../../../../services/amoNotification/sendNotification";
import { baseApiInstance } from "../../../../services/requests/axios.instance";
import { TranscriptionTaskStatus } from "../../../../enums/transcriptionTaskStatus";
import { useWebSocket } from "../../../../services/websocket/useWebSocket";
import { apiWSOrigin } from "../../../../config";


export function NotTranscriptedCall({
    transcriptionData,
    setTranscriptionData,
    callEventId,
    callNoteId,
    entityType,
}) {
    const [isTaskCreation, setIsTaskCreation] = useState(false);
    const [isTaskCreatingError, setIsTaskCreatingError] = useState(false);
    const [stateText, setStateText] = useState("");
    const [isTaskProcessing, setIsTaskProcessing] = useState(false);
    const [isBalanceError, setIsBalanceError] = useState(false);
    
    const [taskId, setTaskId] = useState(transcriptionData?.task_id || null)


    const processCallTranscription = useCallback(
        async () => {
            try {

                setIsTaskCreation(true);
                setIsTaskCreatingError(false);
                setStateText("Запуск транскрибации");

                const response = await baseApiInstance.post(`/transcriptions/task`, {
                    crm_event_id: callEventId,
                    crm_note_id: callNoteId,
                    created_by: APP.constant("user").id,
                    entity_type : entityType,
                });

                const newTaskId = response?.data?.task_id;
                if (response.status === 200 && newTaskId) {
                    setTaskId(newTaskId);

                    setStateText("Транскрибация звонка начата");
                } else {
                    throw new Error(`Unexpected response: ${response?.status}`);
                }

            } catch (e) {
                console.error("processCallTranscription failed:", e);

                setIsTaskCreatingError(true);
                setStateText("");
                setIsTaskProcessing(false);

                sendAmoErrorNotification("Транскрибация не начата, повторите попытку");
            
            } finally {
                setIsTaskCreation(false);
            }
        }, 
        [callEventId]
    );

    useEffect(() => {
        if (transcriptionData?.status === TranscriptionTaskStatus.PROCESSED) {

        }

        const isProcessed = transcriptionData?.status === TranscriptionTaskStatus.PROCESSED;
        if (!taskId && !isProcessed) {
            processCallTranscription();
        }
    }, [transcriptionData, taskId]);


    const wsUrl = useMemo(() => {
        return taskId ? `${apiWSOrigin}/api/v1/transcriptions/task/${taskId}` : null;
    }, [taskId]);


    const onOpen = useCallback(() => {
        setStateText("Звонок транскрибируется, ожидайте");
    }, []);


    const onMessage = useCallback(async (data) => {
        if (!data || typeof data !== "object") return;

        if (data.type === "welcome") {
            setIsTaskProcessing(true);
            return;
        }
        if (data.type === "pong") return;

        if (data.type === "task_status") {
            if (data.status === TranscriptionTaskStatus.PROCESSED) {
                setStateText("");
                setIsTaskProcessing(false);
                setIsBalanceError(false);

                const response = await baseApiInstance.get(`/transcriptions/${callEventId}/${callNoteId}`);

                setTranscriptionData(response.data);

                close();
            } else if ( data.status === TranscriptionTaskStatus.AWAIT_PAYMENT) {
                setIsBalanceError(true);
                setStateText("Лимит по минутам за день превышен.");
            }
            return;
        }

        if (data.type === "error") {
            setStateText("");
            setIsTaskCreatingError(true);
            sendAmoErrorNotification("Ошибка при получении статуса транскрипции");
        }
        
    }, [callEventId, callNoteId, setTranscriptionData]);

    const onClose  = useCallback(() => {}, []);
    const onError  = useCallback(() => {}, []);

    const { close } = useWebSocket(wsUrl, {
        onOpen,
        onMessage,
        onClose,
        onError,
        heartbeatMs: 15000,
        maxBackoff: 10000,
    });

    const isBusy = isTaskCreation || isTaskProcessing;

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.25rem",
                p: "1rem 0.5rem",
                boxSizing: "border-box",
            }}
        >
            {isBusy && (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.5rem",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {stateText && (
                        <Typography sx={{ fontSize: "1rem" }}>{stateText}</Typography>
                    )}
                    {
                        isBalanceError? 
                                <a 
                                    href={`https://speech2text.ru/rates?crm_account_id=${APP.constant('account').id}`} 
                                    style={{ color: "var(--base_button_active)" }}
                                    target="_blank"
                                >
                                    <Typography sx={{ fontSize: "1rem" }}>Сменить тариф</Typography>
                                </a>
                        : 
                            <CircularProgress size={16} />
                    }
                </Box>
            )}

            {isTaskCreatingError && (
                <Button
                    onClick={processCallTranscription}
                    disabled={isBusy}
                    sx={{
                        borderRadius: "3px",
                        alignSelf: "flex-end",
                        background: "var(--base_button_active)",
                        color: "var(--palette-text-primary)",
                        "&:hover": { background: "var(--base_button_active)", opacity: 0.9 },
                    }}
                >
                    Транскрибировать
                </Button>
            )}
        </Box>
    );
}
