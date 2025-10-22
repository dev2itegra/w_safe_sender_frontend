import React, {useState, useCallback} from "react";
import { Button } from "@mui/material";

import TemplateModal from "./templateModal";

const getNewTemplateBlueprint = () => {
    return {
        name: "",
        channel: "",
        interval: 1,
        send_timings: [
            { id: 0, start: "9:00", end: "19:00" },
            { id: 1, start: "9:00", end: "19:00" },
            { id: 2, start: "9:00", end: "19:00" }, 
            { id: 3, start: "9:00", end: "19:00" }, 
            { id: 4, start: "9:00", end: "19:00" }, 
        ],
        message_text: "",
    }
}


export function CreateTemplateButton({onCreateTemplate, serviceChannels}) {
    const [isTemplateCreating, setIsTemplateCreating] = useState(false);
    const [isTemplateCreatingProcessing, setIsTemplateCreatingProcessing] = useState(false);


    const onStartCreating = useCallback(
        () => {
            setIsTemplateCreating(true);
        }, 
        []
    )

    const processCreatingRequest = useCallback(async (payload) => {
        setIsTemplateCreatingProcessing(true);
        
        await onCreateTemplate(payload);

        setIsTemplateCreatingProcessing(true);
        setIsTemplateCreating(false);
    }, [onCreateTemplate]);
    

    
    return (
        <>
            <Button
                sx={{
                    width: "fit-content",
                    ml: "auto",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.25rem",
                    boxSizing: "border-box",
                    background: "transparent",
                    color: "var(--button_blue)",
                    p: "0",
                    transition: "opacity 0.1s ease-in-out",
                    "&:hover": { opacity: 0.85 },
                    "&:disabled" : { opacity: 0.85 },
                }}
                onClick={onStartCreating}
                disabled={isTemplateCreating}
            >
                <span>Добавить шаблон</span>
            </Button>
            <TemplateModal
                template={getNewTemplateBlueprint()}
                isModalOpen={isTemplateCreating}
                handleClose={() => {setIsTemplateCreating(false)}}
                onProcess={processCreatingRequest}
                isProcessing={isTemplateCreatingProcessing}
                headerName="Создание шаблона"
                actionName="Создать"
                serviceChannels={serviceChannels}
            />
        </>
    ) 
}