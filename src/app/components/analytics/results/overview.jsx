import React from "react";
import { Box, Typography } from "@mui/material";

import AlignVerticalBottomRoundedIcon from '@mui/icons-material/AlignVerticalBottomRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';

import { formatDuration } from "./duration";


export function ResultsOverview({ overview }) {
    const iconStyle =  {
        fontSize: "1.5rem",
        fill: "var(--button_blue)",
    }

    return (
        <Box
            sx={{
                display: overview? "flex" : "none",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "0.5rem",
                boxSizing: "border-box",
            }}
        >
            <Metrics>   
                {
                    overview?
                        <>
                            <Metric 
                                name={"Транскрибировано"} 
                                value={formatDuration(overview.total_duration || 0)} 
                                icon={<AccessTimeFilledRoundedIcon sx={iconStyle}/>}
                            />
                            <Metric 
                                name={"Количество звонков"} 
                                value={overview.total_calls_amount || 0} 
                                icon={<CallRoundedIcon sx={iconStyle}/>}
                            />
                            <Metric 
                                name={"Количество входящих"} 
                                value={overview.incoming_calls_amount || 0} 
                                icon={<CallReceivedRoundedIcon sx={iconStyle}/>}
                            />
                            <Metric 
                                name={"Количество исходящих"} 
                                value={overview.outgoing_calls_amount || 0} 
                                icon={<CallMadeRoundedIcon sx={iconStyle}/>}
                            />
                        </>
                    : <></>
                }
            </Metrics>
        </Box>
    );
}


function Metrics({ children }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "0.5rem",
                width: "100%",
            }}
        >
            {children}
        </Box>
    );
}


function Metric({name, value, icon=null}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
                p: "0.5rem",
                width: "fit-content",
                background: "var(--palette-background-primary)",
            }}
        >
                <Box
                    sx={{
                        display: "flex",
                        px: "0.2rem",
                        alignItems: "center",
                    }}
                >
                    {
                        icon? 
                            icon 
                        : 
                            <AlignVerticalBottomRoundedIcon sx={{fontSize: "1.5rem"}}/>    
                    }
                </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    gap: "0.2rem",
                }}
            >
                <Typography 
                    sx={{
                        fontSize: "0.7rem", 
                        color: "var(--palette-text-secondary-light)",
                        lineHeight: 1,
                    }}
                >
                    {name}
                </Typography>
                <Typography 
                    sx={{
                        fontSize: "1rem", 
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: "0.075rem",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    )
}