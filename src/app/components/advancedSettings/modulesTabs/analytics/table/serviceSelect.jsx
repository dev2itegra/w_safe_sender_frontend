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


function ServiceSelect(
    { 
        services, 
        serviceId, 
        setServiceId, 
        unselected = "__unselected__",
        isLoading = false,
    }
) {
    return (
        <Box sx={{ boxSizing: "border-box", width: "20rem", }}>
            <FormControl fullWidth size="small">
                <InputLabel
                    id="service_label"
                    shrink
                    sx={{
                        color: "var(--palette-border-default)",
                        "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                    }}
                >
                    Сервис
                </InputLabel>

                <Select
                    size="small"
                    labelId="service_label"
                    id="service"
                    value={serviceId ? String(serviceId) : ""}
                    label="Сервис"
                    displayEmpty
                    disabled={isLoading}
                    onChange={(e) => setServiceId(String(e.target.value))}
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
                    {services.map((s) => (
                        <MenuItem 
                            key={String(s.id)} 
                            value={String(s.id)}
                        >
                            {s.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}


export default ServiceSelect;