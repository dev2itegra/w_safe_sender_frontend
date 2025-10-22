import React from "react";
import { Box, Button } from "@mui/material";
import { BorderBottom } from "@mui/icons-material";


export default function SettingsTabSwitcher({ tabs, selectedTabId, onSwitch }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                background: "var(--palette-background-primary)",
                display: "grid",
                gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
            }}
        >
            {
                tabs.map((tab, index) => {
                    return (
                        <Tab 
                            id={tab.id}
                            name={tab.name}
                            onClick={onSwitch}
                            key={index}
                            isSelected={selectedTabId === tab.id}
                        />
                    )
                })
            }
        </Box>
    )
}


function Tab({ id, name, onClick, isSelected }) {
    return (
        <Button
            sx={{
                boxSizing: "border-box",
                background: "transparent",
                py: "0.75rem",
                color: isSelected? "var(--button_blue)" : "var(--palette-text-secondary-dark-green)",
                borderBottom: `2px solid ${isSelected? "var(--button_blue)" : "transparent"}`,
                borderRadius: 0,
                fontWeight: 500,
            }}
            onClick={() => onClick(id)}
        >
            {name}
        </Button>
    )
}