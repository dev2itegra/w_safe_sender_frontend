import React, { useCallback, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";

import styles from "./styles.module.scss";
import onRedirect from "./onRedirect";
import { widgetCode } from "../../config";


export default function ServiceSelect({
    services,
    selectedService,
    setSelectedService,
    isLoading,
}) {
    const processSelecting = useCallback((serviceId) => {
        setSelectedService(serviceId);
    }, [setSelectedService]);

    // If the selected service no longer exists, fallback to "__unselected__"
    // useEffect(() => {
    //     const exists = Array.isArray(services)
    //         && services.some((s) => String(s.id) === String(selectedService));

    //     if (!exists && selectedService !== "__unselected__") {
    //         processSelecting("__unselected__");
    //     }
    // }, [services, selectedService]);

    return (
        <Box sx={{ boxSizing: "border-box", py: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <label htmlFor="service_id" className={clsx(styles.fieldTitle)}>
                    Сервис
                </label>
            </Box>

            <Box 
                sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    width: "100%",
                    gap: "1rem",
                    boxSizing: "border-box",
                }}
            >
                <div className={clsx(styles.templateSelectWrapper)}>
                    <select
                        id="service_id"
                        value={selectedService}
                        onChange={(e) => processSelecting(e.target.value)}
                        className={clsx(
                            styles.templateSelect,
                            selectedService === "__unselected__" ? styles.templateSelectUnselected : ""
                        )}
                        disabled={isLoading}
                    >
                        <option value="__unselected__">Сервис не выбран</option>
                        {services.map((s) => (
                            <option key={s.id} value={String(s.id)}>{s.name}</option>
                        ))}
                    </select>
                </div>
                {
                    isLoading && <CircularProgress size={"1rem"} />
                }
            </Box>

            {/* {
                selectedService === "__unselected__" &&
                <span className={clsx(styles.unselectedWarning)}>Выберите сервис</span>
            } */}
        </Box>
    );
}
