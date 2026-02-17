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


function ChannelSelect(
    { 
        channels, 
        channelId, 
        setChannelId,
        unselected = "__unselected__",
        isLoading,        
    }
) {
    return (
        <Box sx={{ boxSizing: "border-box",  width: "20rem", }}>
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
                    size="small"
                    labelId="channel_label"
                    id="Канал"
                    value={channelId ? String(channelId) : ""}
                    disabled={isLoading}
                    label="Сервис"
                    displayEmpty
                    onChange={(e) => setChannelId(String(e.target.value))}
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
                    <MenuItem 
                        value={unselected}
                    >
                        Не выбран
                    </MenuItem>
                    {channels.map((c) => (
                        <MenuItem 
                            key={String(c.channelId)} 
                            value={String(c.channelId)}
                        >
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}


export default ChannelSelect;