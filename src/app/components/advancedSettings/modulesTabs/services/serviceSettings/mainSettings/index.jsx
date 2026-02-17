import React from "react";
import { Box } from "@mui/material";

import Block from "./block";
import ApiKey from "./apiKey";
import Templates from "./templates/tab";
import TelegramBindStepper from "./tgBindStepper";


export default function ServiceMainSettings(
    { 
        apiKey,
        onSetApiKey,
        isApiKeyEnabled,
        serviceTemplates,
        onCreateTemplate,
        onEditTemplate,
        serviceChannels,
        serviceType,
        linkedPyrogramPhone,
        setLinkedPyrogramPhone,
        serviceId,
    }
) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >   
            {
                serviceType === "wazzup" && 
                <>
                    <Block>
                        <ApiKey 
                            prevApiKey={apiKey}
                            onSetApiKey={onSetApiKey}
                        />
                    </Block>
                    {
                        isApiKeyEnabled &&
                        <Block 
                            sx={{p: 0}} 
                        >
                            <Templates 
                                serviceTemplates={serviceTemplates} 
                                onCreateTemplate={onCreateTemplate}
                                onEditTemplate={onEditTemplate}
                                serviceChannels={serviceChannels}
                                serviceType={serviceType}
                            />
                        </Block>
                    }
                </>
            }
            {
                serviceType === "pyrogram" && 
                <>
                    <Block>
                        <TelegramBindStepper 
                            linkedPyrogramPhone={linkedPyrogramPhone}
                            setLinkedPyrogramPhone={setLinkedPyrogramPhone}
                            serviceId={serviceId}
                        />
                    </Block>
                    {
                        linkedPyrogramPhone &&
                        <Block 
                            sx={{p: 0}} 
                        >
                            <Templates 
                                serviceTemplates={serviceTemplates} 
                                onCreateTemplate={onCreateTemplate}
                                onEditTemplate={onEditTemplate}
                                serviceChannels={serviceChannels}
                                serviceType={serviceType}
                            />
                        </Block>
                    }
                </>
            }
        </Box>
    )
}