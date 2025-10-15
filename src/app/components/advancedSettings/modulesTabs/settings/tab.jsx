import React, { useState } from "react";
import { 
    Box,
    Button,
    Typography,
} from "@mui/material";

import { Block as SettingsBlock } from "./block.jsx";
import { AutoTranscriptionCall } from "./transcription/autoTranscription.jsx";
import { Account } from "./account/account.jsx";
import { baseApiInstance } from "../../../../services/requests/axios.instance.js";
import { sendAmoErrorNotification, sendAmoSuccessNotification } from "../../../../services/amoNotification/sendNotification.js";


export function SettingsTab({ 
    widget, 
    userSettings, 
    managersList, 
    pipelinesStatuses,
    tariffication,
}) {
    const [isChanged, setIsChanged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState(userSettings);

    const handleSettingsChange = (callType, slice) => {
        setSettings(prev => ({
            ...prev,
            [callType]: slice,
        }));
        setIsChanged(true);
    };

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "6fr 4fr",
                    gap: "1rem",
                    position: "relative",
                }}
            >
                <SettingsBlock blockName={"Транскрибация звонков"}>
                    <AutoTranscriptionCall 
                        callType={"incoming"} 
                        transcriptionSettings={settings} 
                        managersList={managersList} 
                        pipelinesStatuses={pipelinesStatuses} 
                        onChange={handleSettingsChange}
                    />
                    <AutoTranscriptionCall 
                        callType={"outgoing"} 
                        transcriptionSettings={settings} 
                        managersList={managersList} 
                        pipelinesStatuses={pipelinesStatuses}
                        onChange={handleSettingsChange} 
                    />
                </SettingsBlock>
                <SettingsBlock blockName={"Аккаунт Speech2Text"}>
                    <Account tariffication={tariffication}/>
                </SettingsBlock>    
            </Box>
            {isChanged? 
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        p: "1rem",
                        position: "fixed",
                        bottom: "0%",
                        right: "0%",
                        zIndex: 50,
                        boxSizing: "border-box",
                        // backgroundColor: "var(--palette-background-primary)",
                        // borderTop: "1px solid var(--palette-border-primary)",
                    }}
                >
                
                    <Button 
                        disabled={isSaving}
                        sx={{
                            ml: "auto",
                            background: "var(--base_active_color)",
                            px: "2.5rem",
                            boxSizing: "border-box",
                            color: "white",
                            "&:hover" : {

                            },
                        }}
                        onClick={
                            (
                                async () => {
                                    try {
                                        setIsSaving(true);
                                        const response = await baseApiInstance.patch("/settings", settings);
                                        setIsChanged(false);
                                        sendAmoSuccessNotification("Настройки сохранены!");                                        
                                        
                                    } catch (error) {
                                        console.error(error);
                                        sendAmoErrorNotification("Настройки не сохранены!");
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }
                            )
                        }
                    >
                        {isSaving? "Сохранение..." : "Сохранить"}
                    </Button>
                </Box> : <></>
            }
        </>
    )
}