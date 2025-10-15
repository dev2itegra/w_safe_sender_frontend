import React from "react";
import { Box, FormControl, TextField } from "@mui/material";


export default function Prompt({ prompt, setPrompt }) {
    return (
        <Box
            sx={{
                width: "70%",
                boxSizing: "border-box",
            }}
        >
            <FormControl fullWidth size="small">
                <TextField
                    label="Промпт"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline
                    minRows={5}
                    maxRows={5}
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
                            "&.Mui-focused": { color: "var(--palette-accent, #1976d2)" },
                        },
                        "& .MuiInputBase-input": {
                            color: "var(--palette-text-primary)",
                        },
                    }}
                />
            </FormControl>
        </Box>
    );
}
