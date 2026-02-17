import React, { useEffect, useCallback, useState } from "react";
import { Box } from "@mui/material";

import ServicesTable from "./servicesTable";
import AddServiceButton from "./addServiceButton";
import ServiceSettings from "./serviceSettings";
import ServicesLoading from "./loading";
import { baseApiInstance } from "../../../../services/requests/axios.instance";
import { sendAmoErrorNotification } from "../../../../services/amoNotification/sendNotification";


export default function ServicesSettings({  }) {
    const [isLoading, setIsLoading] = useState(true);

    const [includedServices, setIncludedServices] = useState([]);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await baseApiInstance.get("/services/");
                
                let services = [];
                if ( response.status === 200 ) {
                    services = response.data.services;
                }
            
                setIncludedServices(services);


            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false);
            }
        }
        loadServices();
    }, []);
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewServiceCreating, setIsNewServiceCreating] = useState(false);
    
    const [serviceType, setServiceType] = useState("wazzup");
    const [serviceName, setServiceName] = useState("");

    const [openedServiceId, setOpenedServiceId] = useState(null);

    const onOpenService = useCallback((id) => {
        setOpenedServiceId(id);
    }, [openedServiceId]);


    const onModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);


    const onNewServiceCreate = useCallback(async () => {
        try {
            setIsNewServiceCreating(true);

            if ( serviceType === "wazzup" ) {
                const response = await baseApiInstance.post(
                    "/services", 
                    {
                        "name": `[WAZZUP] ${serviceName}`,
                        "type": "wazzup",
                    }
                );

                const createdServiceId = response.data.id;

                const prevServices = JSON.parse(JSON.stringify(includedServices)); 
                prevServices.push(
                    {
                        id: createdServiceId,
                        name: `[WAZZUP] ${response.data.name}`,
                        subscription: {
                            is_trial: true,
                            end_date: "2025-12-31",
                        },
                        is_token_linked: false,
                    }
                );

                setIncludedServices(prevServices);
                onOpenService(createdServiceId);

            } else if ( serviceType === "pyrogram" ) {
                const response = await baseApiInstance.post(
                    "/services", 
                    {
                        "name": `[TELEGRAM] ${serviceName}`,
                        "type": "pyrogram",
                    }
                );

                const createdServiceId = response.data.id;

                const prevServices = JSON.parse(JSON.stringify(includedServices)); 
                prevServices.push(
                    {
                        id: createdServiceId,
                        name: `[TELEGRAM] ${response.data.name}`,
                        subscription: {
                            is_trial: true,
                            end_date: "2025-12-31",
                        },
                        is_token_linked: false,
                    }
                );

                setIncludedServices(prevServices);
                onOpenService(createdServiceId);
            } else {
                throw new Error(`invalid service "${serviceType}"`);
            }

        } catch (error) {
            console.error(error);
            sendAmoErrorNotification("Ошибка подключения сервиса");
        } finally {
            setIsModalOpen(false);
            setIsNewServiceCreating(false);
        }
    }, [serviceType, serviceName]);


    const moveBackFromService = useCallback(() => {
        setOpenedServiceId(null);
    }, []);

    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >   
            {
                isLoading ?
                    <ServicesLoading />
                :
                    openedServiceId? 
                        <ServiceSettings
                            serviceId={openedServiceId}
                            onMoveBack={moveBackFromService}
                        />
                    :
                        <Box
                            sx={{
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                            }}
                        >
                            <ServicesTable 
                                services={includedServices}
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                isNewServiceCreating={isNewServiceCreating}
                                serviceType={serviceType}
                                setServiceType={setServiceType}
                                serviceName={serviceName}
                                setServiceName={setServiceName}
                                onModalClose={onModalClose}
                                onNewServiceCreate={onNewServiceCreate}
                                onOpenService={onOpenService}
                            /> 
                            {
                                includedServices.length !== 0 && 
                                <AddServiceButton 
                                    disabled={false}
                                    onClick={() => setIsModalOpen(true)}
                                />
                            }
                        </Box>
            }
        </Box>
    );
} 
