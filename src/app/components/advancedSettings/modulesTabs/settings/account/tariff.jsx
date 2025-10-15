import React from "react";

import { Box, Typography } from "@mui/material";


export function Tariff({ available, used, balance }) {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                boxSizing: "border-box",
            }}
        >   
            <Typography
                sx={{
                    fontSize: "0.9rem",
                }}    
            >
                Информация по тарифу на сегодня
            </Typography>
            <ProgressBar used={used} available={available} />
            <Balance balance={balance}/>
        </Box>
    )
}


function ProgressBar({ used, available }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    borderRadius: "0.25rem",
                    display: "flex",
                    position: "relative",
                    height: "1rem",
                    background: "var(--palette-border-default)",
                    boxSizing: "border-box",
                }}
            >
                <Typography
                    sx={{
                        position: "absolute",
                        top: "calc(50% - 0.35rem)",
                        left: "0.5rem",
                        fontSize: "0.8125rem",
                        lineHeight: 1,
                        fontWeight: 400,
                        letterSpacing: "0.03rem",
                        color: "#ffffff",
                    }}
                >
                    {`Осталось ${available} мин`}
                </Typography>
                <Box
                    sx={{
                        backgroundColor: "var(--button_blue)",
                        borderRadius: "inherit",
                        boxSizing: "border-box",
                        borderTopRightRadius: ((available / (used + available)) < 0.99)? 0 : "inherit",
                        borderBottomRightRadius: ((available / (used + available)) < 0.99)? 0 : "inherit",
                        height: "100%",
                        width: (available / (used + available))
                    }}
                >
                </Box>

            </Box>
        </Box>
    )
}


function Balance({ balance }) {
    function formatBalance(value) {
        return new Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    return <>
        <Typography
            sx={{
                fontSize: "0.9rem",
                mt: "0.2rem",
                letterSpacing: "0.03rem",
            }}
        >
            {`Баланс: ${formatBalance(balance)} рублей`}
        </Typography>
    </>
}