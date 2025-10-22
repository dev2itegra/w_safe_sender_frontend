import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import clsx from "clsx";

import TemplateSelect from "./templateSelect";
import TemplateOverview from "./templateOverview";
import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification";
import { baseApiInstance } from "../../services/requests/axios.instance";
import ServiceSelect from "./serviceSelect";


export default function DigitalPipelineSettings({
    prevCustomSettings,
    onCustomSettingsUpdate,
}) {
    console.log(prevCustomSettings);

    const [customSettings, setCustomSettings] = useState(prevCustomSettings || {});
    
    const [isServicesLoading, setIsServicesLoading] = useState(false);
    const [services, setServices] = useState([]);
    
    const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    
    const [serviceId, setServiceId] = useState(prevCustomSettings.service_id || "__unselected__");
    const [selectedTemplate, setSelectedTemplate] = useState(prevCustomSettings.template_id || "__unselected__");

    const [isChannelsLoading, setIsChannelsLoading] = useState(false);
    const [serviceChannels, setServiceChannels] = useState([]);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setIsServicesLoading(true);

                const response = await baseApiInstance.get("/services/");
                
                let services = [];
                if ( response.status === 200 ) {
                    response.data.services.forEach((s) => {
                        if ( s.is_token_linked  ) {
                            services.push(
                                {
                                    id: s.id,
                                    name: s.name,
                                }
                            )
                        }
                    });

                    setServices(services);
                    setServiceId(customSettings.service_id ?? "__unselected__");
                    setIsServicesLoading(false);
                } else {
                    throw new Error(`Unexpected response status: ${response}`);
                }

            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка загрузки сервисов");
            }
        }
        loadServices();      
    }, []);


    useEffect(() => {
        const loadTemplatesData = async () => {
            if ( serviceId && serviceId !== "__unselected__" ) {
                try {
                    setIsTemplatesLoading(true);
                    
                    const response = await baseApiInstance.get(`/services/${serviceId}/templates`);
                    const templates = response.data.templates;
    
                    setTemplates(templates);
                    setSelectedTemplate(customSettings.template_id ?? "__unselected__");
                    setIsTemplatesLoading(false);
                } catch (error) {
                    console.error(error);
                    sendAmoErrorNotification("Ошибка загрузки шаблонов");
                }
            }
        };
        
        loadTemplatesData();
    }, [serviceId]);

    
    useEffect(() => {
        const loadChannels = async () => {
            try {
                setIsChannelsLoading(true);
                
                const response = await baseApiInstance.get(`/channels/service/${serviceId}`);
                if ( response.status === 200 ) {
                    let channels = response.data.channels;
                    setServiceChannels(channels);
                } else {
                    throw new Error(`Unexpected response: ${response}`);
                }
            
            } catch (error) {
                console.error(error);
                sendAmoErrorNotification("Ошибка загрузки каналов");
            } finally {
                setIsChannelsLoading(false);
            }
        };
        loadChannels();
    }, [serviceId]);


    useEffect(() => {
        setCustomSettings(prevCustomSettings || {});
        setSelectedTemplate(prevCustomSettings?.template_id ?? "__unselected__");
    }, [prevCustomSettings]);

    useEffect(() => {
        setSelectedTemplate(customSettings?.template_id ?? "__unselected__");
    }, [customSettings?.template_id]);

    const handleSelectTemplate = useCallback((id) => {
        setSelectedTemplate(id);

        setCustomSettings((prev) => {
            const next = { ...prev };

            if (id === "__unselected__") {
                delete next.template_id;
            } else {
                // Store as number when possible
                next.template_id = /^\d+$/.test(String(id)) ? Number(id) : id;
            }

            onCustomSettingsUpdate(next);
            return next;
        });
    }, [onCustomSettingsUpdate]);

    const handleSelectService = useCallback((id) => {
        setServiceId(id);

        setCustomSettings((prev) => {
            const next = { ...prev };

            if (id === "__unselected__") {
                delete next.service_id;
            } else {
                // Store as number when possible
                next.service_id = /^\d+$/.test(String(id)) ? Number(id) : id;
            }

            onCustomSettingsUpdate(next);
            return next;
        });
    }, [onCustomSettingsUpdate]);

    
    return (
        <Box 
            sx={{ 
                boxSizing: "border-box", 
                mb: "2rem", 
                pr: "20px",
            }}
        >
            <Box 
                sx={{ 
                    width: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "1rem",
                    boxSizing: "border-box",
                }}
            >
                <ServiceSelect 
                    services={services}
                    selectedService={serviceId}
                    setSelectedService={handleSelectService}
                    isLoading={isServicesLoading || isTemplatesLoading}
                />
                { 
                    serviceId && serviceId !== "__unselected__" && !isTemplatesLoading && !!services.length &&
                    <TemplateSelect
                        templates={templates}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={handleSelectTemplate}
                    />
                }
                {
                    serviceId && serviceId !== "__unselected__" && !isTemplatesLoading && selectedTemplate && selectedTemplate !== "__unselected__" &&
                    <TemplateOverview
                        template={templates.find((t) => String(t.id) === String(selectedTemplate))}
                    />
                }
            </Box>
        </Box>
    );
}
