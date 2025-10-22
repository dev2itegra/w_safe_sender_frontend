import React from "react";
import { Box, FormControl, TextField } from "@mui/material";


export default function TemplateMessageText({ messageText, setMessageText }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
            }}
        >
            <FormControl fullWidth size="small">
                <TextField
                    label="Текст сообщения"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    multiline
                    minRows={6}
                    maxRows={6}
                    variant="outlined"
                    type="text"
                    inputProps={{ inputMode: "text" }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "var(--palette-text-primary)",
                            "& fieldset": { borderColor: "var(--palette-border-default)" },
                            "&:hover fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                            "&.Mui-focused fieldset": { borderColor: "var(--palette-accent, #1976d2)" },
                            // height: "175px",
                            // maxHeight: "175px",
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
