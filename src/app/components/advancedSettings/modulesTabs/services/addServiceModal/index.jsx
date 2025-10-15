import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Box, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Divider, } from "@mui/material";

import ModalHeader from "./modalHeader";
import ServiceTypeSelect from "./serviceTypeSelect";
import ServiceNameInput from "./serviceNameInput";
import ProcessServiceCreatingButton from "./processCreatingButton";


export default function NewServiceModal({
    isModalOpen,
    handleClose,
    onProcess,
    isProcessing,
    serviceType,
    setServiceType,
    serviceName,
    setServiceName,
}) {
    const disabled = isProcessing;

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            sx={{
                display: "grid",
                placeItems: "center",
                p: 2,
                outline: "none",
            }}
        >
            <Box
                sx={{
                    width: "30rem",
                    maxHeight: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    border: "1px solid var(--palette-border-primary)",
                    background: "var(--palette-background-primary)",
                    boxSizing: "border-box",
                    borderRadius: 0,
                    boxShadow: 24,    

                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--palette-border-default)",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "var(--palette-border-primary)",
                    },

                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--palette-border-default) transparent",
                }}
            >
                <ModalHeader 
                    handleClose={handleClose} 
                    headerName={"Подключение нового сервиса"} 
                />
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        p: "0.5rem 1rem",
                        boxSizing: "border-box",
                        borderBottom: "1px solid var(--palette-border-default)",
                    }}
                >
                    <ServiceTypeSelect 
                        serviceType={serviceType}
                        setServiceType={setServiceType}
                    />
                    <ServiceNameInput
                        serviceName={serviceName}
                        setServiceName={setServiceName}
                    />
                </Box>
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        p: "0.75rem 1rem",       
                    }}
                >
                    <ProcessServiceCreatingButton 
                        disabled={isProcessing}
                        onClick={onProcess}
                    />
                </Box>
            </Box>
        </Modal>
    );
};


