import React, { useCallback, useState } from "react";
import { 
    Box, 
    Typography, 
    IconButton, 
    TextField,
    InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";


export default function ServiceName({ serviceName, onUpdateServiceName, prefix = "[WAZZUP]" }) {
    const [isEditing, setIsEditing] = useState(false);
    
    const [localName, setLocalName] = useState(serviceName);

    const handleEditClick = () => setIsEditing(true);

    const handleChange = (event) => {
        setLocalName(event.target.value);
    };

    const isNameValid = (name) => {
        return (name.trim()).length > 3;
    }

    const handleBlur = useCallback(async () => {
        if (isNameValid(localName)) {
            await onUpdateServiceName(localName.trim());
        } else {
            setLocalName(serviceName);
        }
        setIsEditing(false)
    }, [localName, serviceName]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setIsEditing(false);
        }
    };

    return (
        <Box sx={{ alignSelf: "flex-start" }}>
            {isEditing ? (
                <TextField
                    id="service_name"
                    variant="standard"
                    autoFocus
                    fullWidth
                    value={localName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    sx={{
                        width: "40rem",
                        "& .MuiInputBase-input": {
                            fontSize: "1.5rem",
                            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                            color: "var(--palette-text-default)", 
                        },
                    }}
                    slotProps={{
                        input: {
                            sx: {
                                width: "40rem",
                                "&& .MuiInputBase-input": {
                                    color: "var(--palette-text-primary)",
                                    fontSize: "1rem",
                                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                                },
                                "&& .MuiInputBase-input::placeholder": {
                                    color: "var(--palette-text-primary)",
                                    opacity: 0.6,
                                },
                                "&& input:-webkit-autofill": {
                                    WebkitTextFillColor: "var(--palette-text-primary)",
                                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                                },
                            },
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
                />
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1.5rem",
                            lineHeight: 1.334,
                            maxWidth: "10rem",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                        }}
                    >
                        {prefix}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "1.5rem",
                            lineHeight: 1.334,
                            maxWidth: "40rem",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                        }}
                    >
                        {serviceName}
                    </Typography>
                    <IconButton
                        sx={{
                            color: "var(--palette-text-secondary-dark-green)",
                        }}
                        onClick={handleEditClick}
                    >
                        <EditIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}
