import React, { useEffect, useCallback, useState } from "react";
import { Box } from "@mui/material";

import ServicesTable from "./servicesTable";
import AddServiceButton from "./addServiceButton";


export default function ServicesSettings({  }) {
    const includedServices = [

    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewServiceCreating, setIsNewServiceCreating] = useState(false);
    
    const [serviceType, setServiceType] = useState("wazzup");
    const [serviceName, setServiceName] = useState("[WAZZUP] ");

    useEffect(() => {
        if (!serviceName) {
            if (serviceType === "wazzup") {
                setServiceName("[WAZZUP] ");
            }
        }
    }, [serviceType]);

    const onModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);


    const onNewServiceCreate = useCallback(async () => {
        try {
            setIsNewServiceCreating(true);

            console.log("Service creating", serviceType, serviceName);
        } catch (error) {
            console.error(error);
        } finally {
            setIsNewServiceCreating(false);
        }
    }, [serviceType, serviceName]);

    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >
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
                /> 
                {
                    includedServices.length !== 0 && 
                    <AddServiceButton 
                        disabled={false}
                        onClick={onNewServiceCreate}
                    />
                }
            </Box>
        </Box>
    );
} 
