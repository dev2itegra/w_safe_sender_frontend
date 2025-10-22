import React from "react";
import { Box } from "@mui/material";

import Block from "./block";
import CurrentSubscription from "./currentSubscription";
import TariffsBlock from "./tariffs";


export default function ServiceBilling({ isTrialSubscription, subscriptionEndDate, serviceId }) {
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
            <Block>
                <CurrentSubscription 
                    isTrialSubscription={isTrialSubscription}
                    subscriptionEndDate={subscriptionEndDate}
                />
            </Block>
            <Block>
                <TariffsBlock serviceId={serviceId} />
            </Block>
        </Box>
    )
}