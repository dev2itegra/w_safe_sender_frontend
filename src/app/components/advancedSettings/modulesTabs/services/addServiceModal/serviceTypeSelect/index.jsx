import React from "react";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import WazzupLogo from "./logos/wazzup";
import TelegramIcon from '@mui/icons-material/Telegram';


const SERVICES = {
    wazzup: { label: "Wazzup", Icon: WazzupLogo },
    pyrogram: { label: "Телеграм", Icon: TelegramIcon },
};


export default function ServiceTypeSelect({ serviceType, setServiceType }) {
    const renderValue = (value) => {
        const item = SERVICES[value];
        if (!item) return ;
        const Icon = item.Icon;
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon sx={{ fontSize: "1.25rem", color: "inherit" }} />
                <span style={{ lineHeight: 1 }}>{item.label}</span>
            </Box>
        );
    };

    return (
        <Box 
            sx={{ 
                boxSizing: "border-box", 
                py: "0.5rem",
            }}
        >
            <FormControl fullWidth size="small">
                <InputLabel
                    id="service_type_label"
                    shrink
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Сервис
                </InputLabel>

                <Select
                    labelId="service_type_label"
                    id="service_type"
                    value={serviceType ?? ""}
                    label="Сервис"
                    displayEmpty
                    onChange={(e) => setServiceType(e.target.value)}
                    renderValue={renderValue}
                    sx={{
                        color: "var(--palette-text-primary)",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-border-default)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--palette-accent, #1976d2)",
                        },
                        "& .MuiSelect-select": {
                            py: "8.5px",
                            minHeight: 0,
                            color: "var(--palette-text-primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        },
                        "& .MuiSvgIcon-root": {
                            color: "var(--palette-text-primary)",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                background: "var(--palette-background-primary)",
                                border: `1px solid var(--palette-border-primary)`,
                                "& .MuiMenuItem-root": {
                                    color: "var(--palette-text-primary)",
                                },
                                "& .MuiListItemIcon-root": {
                                    minWidth: 32,
                                    color: "inherit",
                                },
                            },
                        },
                    }}
                >
                    {Object.entries(SERVICES).map(([value, { label, Icon }]) => {
                            return (
                                <MenuItem key={value} value={value}>
                                    <ListItemIcon>
                                        <Icon sx={{ fontSize: "1.25rem", width: "1.25em", height: "1.25em", }} />
                                    </ListItemIcon>
                                    <ListItemText primary={label} primaryTypographyProps={{ lineHeight: 1 }} />
                                </MenuItem>
                            )
                        }
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}
