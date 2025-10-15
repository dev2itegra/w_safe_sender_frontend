import { Box, Typography } from "@mui/material";
import React, { useCallback } from "react";



export default function AllowedTiming({}) {

    const onCheckDay = useCallback((id, state) => {

    })

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
            }}
        >
            <WeekDays />
        </Box>
    )
}


function WeekDays({onCheckDay}) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "1px",
                p: "5px",
                border: "1px solid var(--palette-border-default)",
            }}
        >
            <Day name={"Пн"} />
            <Day name={"Вт"} />
            <Day name={"Ср"} />
            <Day name={"Чт"} />
            <Day name={"Пт"} />
            <Day name={"Сб"} />
            <Day name={"Вс"} />
            <DayCheckbox id={1} onCheck={onCheckDay} />
            <DayCheckbox id={2} onCheck={onCheckDay} />
            <DayCheckbox id={3} onCheck={onCheckDay} />
            <DayCheckbox id={4} onCheck={onCheckDay} />
            <DayCheckbox id={5} onCheck={onCheckDay} />
            <DayCheckbox id={6} onCheck={onCheckDay} />
            <DayCheckbox id={6} onCheck={onCheckDay} />
        </Box>
    )
}

function Day({ name }) {
    return (
        <Box
            sx={{
                background: "var(--palette-background-primary)",
                display: "flex", 
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography
                sx={{

                }}
            >
                {name}
            </Typography>
        </Box>
    )
}


function DayCheckbox({ id, onCheck }) {
    return (
        <Box
            sx={{
                height: "2rem",
            }}
        >

        </Box>
    )
}
