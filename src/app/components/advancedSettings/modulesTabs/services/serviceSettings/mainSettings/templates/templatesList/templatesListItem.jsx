import React, { useCallback, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

import TemplateModal from "../templateModal";


export default function TemplatesListItem(
    { 
        template, 
        isFirst = false,
        isLast = false,
        onEditTemplate,
        serviceChannels,
        serviceType,
    }
) {    
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProcessing, setIsEditingProcessing] = useState(false);

    const onTemplateEdit = useCallback(() => {
        setIsEditing(true);
    }, []);


    const processEditingRequest = useCallback(async (payload) => {
        setIsEditingProcessing(true);

        await onEditTemplate(payload);
        
        setIsEditingProcessing(false);
        setIsEditing(false);
    }, []);

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    py: "1rem",
                    borderTop: `1px solid ${isFirst? "var(--palette-border-primary)" : "transparent"}`,
                    borderBottom: `1px solid ${isLast? "transparent" : "var(--palette-border-primary)"}`,
                    display: "grid",
                    gridTemplateColumns: "5% 15% 50% auto",
                }}
            >  
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        pl: "1rem",
                        pr: "0.5rem",
                    }}
                >   
                    <TemplateChannel channel={template.channel} serviceChannels={serviceChannels} />
                </Box>
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        px: "0.5rem",
                    }}
                >
                    <TemplateName name={template.name} />
                </Box>
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        px: "0.5rem",
                    }}
                >
                    <TemplateMessagePreview message={template.message_text} />
                </Box>
                <Box
                    sx={{
                        boxSizing: "border-box",
                        ml: "auto",
                        display: "flex",
                        alignItems: "center",
                        pl: "0.5rem",
                        pr: "1rem",
                    }}
                >
                    <EditTemplate disabled={isEditing} onClick={onTemplateEdit}/>
                </Box>
            
            </Box>
            <TemplateModal
                template={template}
                isModalOpen={isEditing}
                handleClose={() => {setIsEditing(false)}}
                onProcess={processEditingRequest}
                isProcessing={isEditingProcessing}
                headerName="Редактирование шаблона"
                actionName="Сохранить"
                serviceChannels={serviceChannels}
                serviceType={serviceType}
            />
        </> 
    );
} 


function TemplateName({ name }) {
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    lineHeight: 1,
                    letterSpacing: "0.00938em",
                }}
            >
                {name}
            </Typography>
        </Box>
    )
}


function TemplateChannel({ channel, serviceChannels }) {

    const getChannelIcon = useCallback(() => {
        const channelData = serviceChannels.find((c) => c.channelId === channel);
        if ( channelData ) {
            if ( channelData.transport === "telegram" ) {
                return <TelegramIcon sx={{fontSize: "1.5rem", color: "inherit"}} />
            }
            if ( channelData.transport === "whatsapp" ) {
                return <WhatsAppIcon sx={{fontSize: "1.5rem", color: "inherit"}} />
            }
        }
    }, [channel, serviceChannels]);
    
    const icon = getChannelIcon();

    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    lineHeight: 1,
                    letterSpacing: "0.00938em",
                }}
            >
                {icon ?? null}
            </Typography>
        </Box>
    )
}


function TemplateMessagePreview({ message }) {
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    lineHeight: 1,
                    letterSpacing: "0.00938em",
                    fontSize: "0.8125rem",
                    opacity: 0.6,
                    fontWeight: 300,
                }}
            >
                {message}
            </Typography>
        </Box>
    )
}



function EditTemplate({disabled, onClick}) {
    return (
        <Button
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
                cursor: "pointer",
                p: "0.25rem 0.5rem",
                m: 0,
                minWidth: 0,
                color: disabled? "var(--palette-text-secondary-dark-green)" : "var(--button_blue)",
            }}
            title="Редактировать шаблон"
            onClick={onClick}
        >           
            <EditIcon sx={{fontSize: "1.25rem"}} />
        </Button>
    );
}