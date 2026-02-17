import React, { useEffect } from "react";
import { TextField } from "@mui/material";


function CodeInput({ code, setCode, setIsCodeValid }) {
    const handleChange = (e) => {
        const value = e.target.value.slice(0, 5);
        setCode(value);
    };

    useEffect(() => {
        setIsCodeValid(!(code.length > 0 && code.length < 5));
    }, [code]);

    const isError = code.length > 0 && code.length < 5;

    return (
        <TextField
            label="Код подтверждения"
            value={code}
            onChange={handleChange}
            size="small"
            variant="outlined"
            type="text"
            inputProps={{
                inputMode: "text",
                maxLength: 5,
            }}
            error={isError}
            // helperText={isError ? `Длина кода: ${code.length}/5` : ""}
            slotProps={{}}
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
    );
}

export default CodeInput;
