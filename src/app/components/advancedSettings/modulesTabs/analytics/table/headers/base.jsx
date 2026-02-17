import React, { useState } from "react";
import {
    TableCell,
    Popover,
    Box,
    Typography,
    Checkbox,
    Button,
} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';


function BaseTableHeader(
    { 
        name, 
        children, 
        disabled = false, 
        enabled = false,
    }
) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <TableCell
                onClick={disabled? () => {} : handleOpen}
                sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.05rem",
                    userSelect: "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        color: "inherit",
                        display: "flex",
                        boxSizing: "border-box",
                        alignItems: "center",
                        color: enabled? "var(--button_blue)" : "var(--palette-text-secondary-light)",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: "inherit",
                            fontSize: "inherit",
                            textTransform: "inherit",
                            lineHeight: "inherit",
                            letterSpacing: "inherit",
                            color: "inherit",
                            width: "fit-content",
                        }}
                    >
                        { name }
                    </Typography>
                    {
                        enabled &&
                        <FilterAltIcon sx={{ fontSize: "1rem", ml: "auto", color: "inherit" }} />
                    }
                </Box>
            </TableCell>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            p: "1rem",
                            borderRadius: "0px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            backgroundColor: "var(--palette-background-primary)",
                            border: "1px solid var(--palette-border-default)",
                            minWidth: 280,
                        },
                    },
                }}
            >
                {children}
            </Popover>
        </>
    );
}

export default BaseTableHeader;