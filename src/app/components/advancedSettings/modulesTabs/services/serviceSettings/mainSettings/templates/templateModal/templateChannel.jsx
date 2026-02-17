import React, { useMemo } from "react";
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


export default function TemplateChannelSelect({ channel, setChannel, serviceChannels }) {
    const selectedChannel = useMemo(
        () => serviceChannels?.find((c) => String(c.channelId) === String(channel)),
        [serviceChannels, channel],
    );

    const renderValue = (value) => {
        const ch = serviceChannels?.find((c) => String(c.channelId) === String(value));
        if (!ch) {
            return <span style={{ lineHeight: 1, opacity: 0.7 }}>Не выбран</span>;
        }
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {ch.transport === "whatsapp" && <WhatsAppIcon sx={{ fontSize: "1.25rem", color: "inherit" }} />}
                {ch.transport === "telegram" && <TelegramIcon sx={{ fontSize: "1.25rem", color: "inherit" }} />}
                <span style={{ lineHeight: 1 }}>{ch.name}</span>
            </Box>
        )
    };

    return (
        <Box sx={{ boxSizing: "border-box" }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="channel_label"
                    shrink
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
                    value={selectedChannel ? String(selectedChannel.channelId) : ""}
                    label="Канал"
                    displayEmpty
                    onChange={(e) => setChannel(String(e.target.value))}
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
                                "& .MuiMenuItem-root": { color: "var(--palette-text-primary)" },
                                "& .MuiListItemIcon-root": { minWidth: 32, color: "inherit" },
                            },
                        },
                    }}
                >
                    {serviceChannels.map((item) => {
                        return <MenuItem key={String(item.channelId)} value={String(item.channelId)}>
                            <ListItemIcon>
                                {item.transport === "whatsapp" && <WhatsAppIcon sx={{ fontSize: "1.25rem" }} />}
                                {item.transport === "telegram" && <TelegramIcon sx={{ fontSize: "1.25rem" }} />}
                            </ListItemIcon>
                            <ListItemText primary={item.name} primaryTypographyProps={{ lineHeight: 1 }} />
                        </MenuItem>
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
