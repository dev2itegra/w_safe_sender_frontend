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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";


const CHANNELS = {
    tg: { label: "Telegram", Icon: TelegramIcon },
    wp: { label: "WhatsApp", Icon: WhatsAppIcon },
};

export default function TemplateChannelSelect({ channel, setChannel }) {
    const renderValue = (value) => {
        const item = CHANNELS[value];
        if (!item) return "";
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
                    id="channel_label"
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Канал
                </InputLabel>

                <Select
                    labelId="channel_label"
                    id="channel"
                    value={channel ?? ""}
                    label="Канал"
                    displayEmpty
                    onChange={(e) => setChannel(e.target.value)}
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
                    {Object.entries(CHANNELS).map(([value, { label, Icon }]) => (
                        <MenuItem key={value} value={value}>
                            <ListItemIcon>
                                <Icon sx={{ fontSize: "1.25rem" }} />
                            </ListItemIcon>
                            <ListItemText primary={label} primaryTypographyProps={{ lineHeight: 1 }} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
