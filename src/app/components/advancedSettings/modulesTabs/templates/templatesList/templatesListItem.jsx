import React, { useCallback, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

import TemplateModal from "../templateModal";


export default function TemplatesListItem(
    { 
        template, 
        isLast = false,
    }
) {    
    const [isEditing, setIsEditing] = useState(false);


    const onTemplateEdit = useCallback(() => {
        setIsEditing(true);
    }, []);


    

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    py: "1rem",
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
                    <TemplateChannel channel={template.channel} />
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
                handleProcess={() => {}}
                headerName="Редактирование шаблона"
                actionName="Сохранить"
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


function TemplateChannel({ channel }) {

    const getChannelIcon = useCallback(() => {
        if (channel.value === "tg") {
            return <TelegramIcon sx={{fontSize: "1.5rem", color: "inherit"}} />
        }
        if (channel.value === "wp") {
            return <WhatsAppIcon sx={{fontSize: "1.5rem", color: "inherit"}} />
        }
    }, [channel]);
    
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
                {icon ?? channel.name}
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