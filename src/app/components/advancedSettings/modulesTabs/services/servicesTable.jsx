import React, { useCallback, useState, useEffect } from "react";
import { Box, Button } from "@mui/material";


import NewServiceModal from "./addServiceModal";
import TableService from "./tableService";


export default function ServicesTable(
    { 
        services,
        isModalOpen,
        setIsModalOpen,
        isNewServiceCreating,
        serviceType,
        setServiceType,
        serviceName,
        setServiceName,
        onModalClose,
        onNewServiceCreate,
    }
) {
    const isEmpty = services.length === 0;

    return (
        <>
            <Box
                sx={{
                    botSizing: "border-box",
                    width: "100%",
                    display: "grid",
                    gap: "1px",
                    gridTemplateColumns: "1fr 8fr 1fr",
                    backgroundColor: "var(--palette-border-primary)",
                }}
            >   
                <TableHeaderCell name={"Название"} />
                <TableHeaderCell name={"Данные сервиса"} />
                <TableHeaderCell name={"Статус"} />
                {
                    isEmpty && 
                    <AddServiceRow 
                        onCreateService={() => setIsModalOpen(true)}
                    />
                }
                {
                    !isEmpty && services.map((service, key) => {
                        return (
                            <TableService
                                service={service}
                                key={key}
                            />
                        )
                    })
                }
            </Box>
            <NewServiceModal
                isModalOpen={isModalOpen}
                handleClose={onModalClose}
                onProcess={onNewServiceCreate}
                isProcessing={isNewServiceCreating}
                serviceType={serviceType}
                setServiceType={setServiceType}
                serviceName={serviceName}
                setServiceName={setServiceName}
            />
        </>
    )
}


function TableHeaderCell({ name }) {
    return (
        <Box
            sx={{
                backgroundColor: "var(--palette-background-primary)",
                textAlign: "center",
                p: "1rem",
                boxSizing: "border-box",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: "1.5rem",
                letterSpacing: "0.01071em",
            }}
        >
            {name}
        </Box>
    )
}


function AddServiceRow({ onCreateService }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                gridColumn: "span 3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: "1rem",
                backgroundColor: "var(--palette-background-primary)",
            }}
        >
            <Button
                sx={{
                    border: "1px solid var(--button_blue)",
                    background: "transparent",
                    borderRadius: "4px",
                    color: "var(--button_blue)",
                    p: "3px 9px",
                    fontSize: "0.875rem",
                    letterSpacing: "0.01071em",
                }}
                onClick={onCreateService}
            >
                Подключить сервис
            </Button>
        </Box>
    )
}

