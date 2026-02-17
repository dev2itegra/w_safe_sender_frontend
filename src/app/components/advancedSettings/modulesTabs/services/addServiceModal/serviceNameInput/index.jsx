import React from "react";
import {
    Box,
    FormControl,
    TextField,
    InputAdornment,
    Typography,
} from "@mui/material";


export default function ServiceNameInput({ serviceName, setServiceName, prefix }) {
    return (
        <Box sx={{ width: "100%", py: "0.5rem", boxSizing: "border-box" }}>
            <FormControl fullWidth size="small">
                <TextField
                    label="Название"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "text" }}
                    slotProps={{
                        input: {
                            startAdornment: prefix ? (
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        color: "var(--palette-text-primary)",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "var(--palette-text-primary)",
                                            fontSize: "1rem",
                                            userSelect: "none",
                                        }}
                                    >
                                        {prefix}
                                    </Typography>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "var(--palette-text-primary)",
                            "& fieldset": { borderColor: "var(--palette-border-default)" },
                            "&:hover fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                            "&.Mui-focused fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "var(--palette-border-default)",
                            "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputBase-input": { color: "var(--palette-text-primary)" },
                    }}
                />
            </FormControl>
        </Box>
    );
}
