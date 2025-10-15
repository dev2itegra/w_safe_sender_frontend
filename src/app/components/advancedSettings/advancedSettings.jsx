import React, { useState, useEffect } from "react";
import { Box, Typography, } from "@mui/material";

import { SettingsTabs } from "./modulesTabs/SettingsTabs";
import { tabsCtx } from "./modulesTabs/ctx.js";
import { baseApiInstance } from "../../services/requests/axios.instance.js";
import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification.js";
import { LoadingBlock } from "./loadingBlock.jsx";


const AdvancedSettings = ({ widget }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isWidgetActive, setIsWidgetActive] = useState(widget?.params?.active === "Y");

    
    useEffect(() => {
        (async () => {
            if (!isWidgetActive) {
                setIsLoading(false);
                return;
            };
            
            try {
                // const getSettingsResponse = await baseApiInstance.get("/settings/bootstrap");
                // tabsCtx.settings.settings = getSettingsResponse.data.settings;

                setTimeout(setIsLoading(false), 3000);

            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Не удалось загрузить настройки");
            }
        })();
    }, [isWidgetActive]);
    

    return (
        <>
            <Box 
                sx={{ 
                    minHeight: 0, 
                    overflow: "hidden",
                    width: "100%",    
                }}
            >   
                {
                    isWidgetActive ?
                        isLoading? <LoadingBlock /> : <SettingsTabs ctx={tabsCtx} />
                    :
                        <Typography
                            sx={{
                                fontStyle: "italic",
                            }}
                        >
                            Активируйте виджет в разделе amoМаркет
                        </Typography>
                }
            </Box>
        </>
    );
};


export default AdvancedSettings;
