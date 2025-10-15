import React, { useCallback, useState } from "react";
import { Modal, Button, Box, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Divider, } from "@mui/material";


export default function PatternName({ patternName, setPatternName }) {
    return (
        <Box
            sx={{
                width: "100%",
                p: "0.5rem 0.8rem",
                boxSizing: "border-box",
            }}
        >
            <FormControl fullWidth size="small">
                <TextField
                    label="Название шаблона"
                    value={patternName}
                    onChange={(e) => {setPatternName(e.target.value)}}
                    size="small"
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "text" }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "var(--palette-text-primary)",
                            "& fieldset": { borderColor: "var(--palette-border-default)" },
                            "&:hover fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                            "&.Mui-focused fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputLabel-root": {
                            color: "var(--palette-border-default)",
                            "&.Mui-focused": {color: "var(--palette-accent, #1976d2)"},
                        },
                        "& .MuiInputBase-input": {color: "var(--palette-text-primary)"},
                    }}
                />
            </FormControl>
        </Box>
    )
}
