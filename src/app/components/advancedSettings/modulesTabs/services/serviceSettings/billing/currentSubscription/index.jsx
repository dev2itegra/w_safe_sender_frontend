import React, { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import { getSubscriptionText, isExpired } from "../../../../../../../services/subscription/texting";


export default function CurrentSubscription({ isTrialSubscription, subscriptionEndDate }) {
    const getIconColor = useCallback(() => {
        if (isExpired(subscriptionEndDate)) {
            return "rgb(229, 57, 53)";
        }
        return "var(--button_blue)";

    }, [subscriptionEndDate]);
    
    
    return (
        <Box
            sx={{
                display: "flex",
                gap: "0.5rem",
            }}
        >
            <LoyaltyIcon 
                sx={{
                    color: getIconColor(),
                }} 
            />
            <Typography
                sx={{
                    fontSize: "1rem",
                    fontWeight: 300,
                }}
            >
                {getSubscriptionText(subscriptionEndDate, isTrialSubscription)}
            </Typography>
        </Box>
    )
}