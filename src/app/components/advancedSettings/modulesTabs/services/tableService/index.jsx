import React from "react"
import { Box, } from "@mui/material"

import TableCell from "./cell";
import ServiceName from "./name";
import ServiceStatus from "./status";


export default function TableService({ service, onOpenService }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                gridColumn: "span 3",
                display: "grid",
                gridTemplateColumns: "20fr 55fr 25fr",
                backgroundColor: "var(--palette-border-primary)",
                gap: "1px",
            }}
        >   
            <TableCell>
                <ServiceName
                    name={service.name}
                    serviceId={service.id}
                    onClick={onOpenService}
                />
            </TableCell>
            <TableCell>
                {/* <span>информация о сервисе</span> */}
            </TableCell>
            <TableCell>
                <ServiceStatus 
                    isTokenLinked={service.is_token_linked}
                    subscriptionEndDate={service.subscription.end_date}
                    isTrialSubscription={service.subscription.is_trial}
                />
            </TableCell>
        </Box>
    )
}