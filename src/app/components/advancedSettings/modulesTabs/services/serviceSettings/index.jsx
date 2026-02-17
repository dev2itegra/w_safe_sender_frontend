import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ServiceSettingsHeader from "./header";
import SettingsTabSwitcher from "./switcher";
import ServiceMainSettings from "./mainSettings";
import ServiceBilling from "./billing";
import ServicesSettingsLoading from "./loading";
import { baseApiInstance } from "../../../../../services/requests/axios.instance";
import { sendAmoErrorNotification } from "../../../../../services/amoNotification/sendNotification";

const TABS = [
    {
        id: 1,
        name: "Основные настройки",
    },  
    {
        id: 2,
        name: "Оплата",
    },
]


export default function ServiceSettings({ serviceId, onMoveBack }) {
    const [isLoading, setIsLoading] = useState(true);

    const [currentTabId, setCurrentTabId] = useState(TABS[0].id);

    const [serviceType, setServiceType] = useState(null);
    const [serviceName, setServiceName] = useState("");
    
    const [apiKey, setApiKey] = useState("");
    const [isApiKeyEnabled, setIsApiKeyEnabled] = useState(false);
    
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
    const [isTrialSubscription, setIsTrialSubscription] = useState(null);

    const [serviceTemplates, setServiceTemplates] = useState([]);
    const [isTemplatesLoading, setIsTemplatesLoading] = useState(true);

    const [serviceChannels, setServiceChannels] = useState([]);

    const [linkedPyrogramPhone, setLinkedPyrogramPhone] = useState("");


    const getChannels = useCallback(async () => {
        const response = await baseApiInstance.get(`/channels/service/${serviceId}`);
        return response.data?.data?.channels || [];
    }, [serviceId]);


    const onSetApiKey = useCallback(async (value) => {
        if (!!value.length && value !== apiKey) {
            try {
                const response = await baseApiInstance.patch(`/services/${serviceId}`, 
                    {
                        api_token: value,
                    }
                );

                if ( response.status === 200 ) {
                    setApiKey(value);
                    setIsApiKeyEnabled(true);
                }
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка изменения названия сервиса");
            }
        }
    }, [serviceId, apiKey]);


    const onUpdateServiceName = useCallback(async (name) => {
        if (name !== serviceName) {
            try {
                
                const response = await baseApiInstance.patch(`/services/${serviceId}`, 
                    {
                        name: `[WAZZUP] ${name}`,
                    }
                );
    
                if ( response.status === 200 ) {
                    setServiceName(name);
                }
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка изменения названия сервиса");
            }
        }
    }, [serviceId, serviceName]);

    useEffect(() => {
        const loadServiceData = async () => {
            try {
                setIsLoading(true);
                
                const response = await baseApiInstance.get(`/services/${serviceId}`);
                const serviceData = response.data;

                if ( response.data.type === "wazzup" ) {
                    setServiceName(serviceData.name.replace("[WAZZUP] ", ""));
                    setServiceType("wazzup");
                } else if ( response.data.type === "pyrogram" ) {
                    setServiceName(serviceData.name.replace("[TELEGRAM] ", ""));
                    setServiceType("pyrogram");

                    let pn = "";
                    try {
                        pn = serviceData.config.pyrogram_accounts[0].phone_number;
                    } catch (error) {

                    }
                    setLinkedPyrogramPhone(pn);
                }

                setApiKey(serviceData.api_token || "");
                setIsApiKeyEnabled(!!serviceData.api_token);
                
                setSubscriptionEndDate(serviceData.subscription_expires_at);
                setIsTrialSubscription(serviceData.subscription_type === "trial");
                

                setIsLoading(false);
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка при загрузке сервиса");
            } finally {

            }
        };
        loadServiceData()
    }, [serviceId]);

    useEffect(() => {
        const loadTemplatesData = async () => {
            try {
                setIsTemplatesLoading(true);
                
                const response = await baseApiInstance.get(`/services/${serviceId}/templates`);
                const templates = response.data.templates;
                setServiceTemplates(templates);

                setIsTemplatesLoading(false);
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка при загрузке шаблонов");
            } finally {

            }
        };
        loadTemplatesData()
    }, [serviceId]);

    useEffect(() => {
        const loadChannels = async () => {
            if ( isApiKeyEnabled ) {
                try {
                    const channels = await getChannels();
                    setServiceChannels(channels);
                } catch (error) {
                    console.error(error);
                    sendAmoErrorNotification("Ошибка при загрузке каналов");
                }
            }
        };
        loadChannels();
    }, [serviceId, isApiKeyEnabled, apiKey]);

    const onCreateTemplate = useCallback(async (payload) => {
        try {
            const channelToSend = serviceType === "pyrogram"
                ? linkedPyrogramPhone
                : payload.channel;

            const response = await baseApiInstance.post(
                `/services/${serviceId}/templates`,
                {
                    name: payload.name,
                    channel: channelToSend,
                    interval: payload.interval,
                    send_timings: payload.send_timings,
                    message_text: payload.message_text,
                }
            );
            if ( response.status === 201 ) {
                const oldTemplates = JSON.parse(JSON.stringify(serviceTemplates));
                oldTemplates.push(
                    response.data
                )
                setServiceTemplates(oldTemplates);
            }
        } catch (error) {
            console.error(error);
            sendAmoErrorNotification("Ошибка добавления шаблона");
        }
        

    }, [serviceTemplates, linkedPyrogramPhone]);

    
    const onEditTemplate = useCallback(async (payload) => {
        try {   
            const channelToSend = serviceType === "pyrogram"
                ? linkedPyrogramPhone
                : payload.channel;

            const response = await baseApiInstance.put(
                `/services/${serviceId}/templates/${payload.id}`,
                {
                    name: payload.name,
                    channel: channelToSend,
                    interval: payload.interval,
                    send_timings: payload.send_timings,
                    message_text: payload.message_text,
                },
            );
            if ( response.status === 200 ) {
                
            }
        } catch (error) {
            console.error(error);
            sendAmoErrorNotification("Ошибка редактирования шаблона");   
        } finally {

        }
    }, [serviceTemplates]);


    const onTabSwitch = useCallback((id) => {
        if (currentTabId !== id) {
            setCurrentTabId(id);
        }
    }, [currentTabId])

    
    return (
        <>
            {
                isLoading?
                    <ServicesSettingsLoading />
                :
                    <Box
                        sx={{
                            boxSizing: "border-box",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <ServiceSettingsHeader
                            onMoveBack={onMoveBack}
                            serviceName={serviceName}
                            onUpdateServiceName={onUpdateServiceName}
                        />
                        <SettingsTabSwitcher
                            tabs={TABS}
                            onSwitch={onTabSwitch}
                            selectedTabId={currentTabId}
                        />
                        {
                            currentTabId === 1 && 
                            <ServiceMainSettings 
                                apiKey={apiKey}
                                onSetApiKey={onSetApiKey}
                                isApiKeyEnabled={isApiKeyEnabled}
                                serviceTemplates={serviceTemplates}
                                onCreateTemplate={onCreateTemplate}
                                onEditTemplate={onEditTemplate}
                                serviceChannels={serviceChannels}
                                serviceType={serviceType}
                                linkedPyrogramPhone={linkedPyrogramPhone}
                                setLinkedPyrogramPhone={setLinkedPyrogramPhone}
                                serviceId={serviceId}
                            />
                        }
                        {
                            currentTabId === 2 && 
                            <ServiceBilling 
                                isTrialSubscription={isTrialSubscription}
                                subscriptionEndDate={subscriptionEndDate}
                                serviceId={serviceId}
                            />
                        }
                    </Box>
                        
            }
        </>
    )
}