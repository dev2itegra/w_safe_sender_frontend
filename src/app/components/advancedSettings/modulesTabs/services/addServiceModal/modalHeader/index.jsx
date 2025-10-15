import React from "react"
import { Button, Typography, Box } from "@mui/material"


export default function ModalHeader({ handleClose, headerName }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                py: "0.5rem",
                px: "0.8rem",
                gap: "1rem",
                borderBottom: "1px solid var(--palette-border-default)",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Typography 
                    sx={{
                        fontSize: "1.1rem",
                        lineHeight: 1.1,
                        fontWeight: 500,
                    }}
                >
                    {headerName}
                </Typography>
            </Box>
            <Button
                onClick={handleClose}
                sx={{
                    ml: "auto",
                    p: 0,
                    minWidth: 0,
                    fontSize: "1.5rem",
                    alignSelf: "flex-start",
                    justifyContent: "flex-end",
                    color: "var(--button_blue)",
                    "&:hover": { backgroundColor: "transparent", boxShadow: "none", opacity: "0.75" },
                }}
            >
                &#10006;
            </Button>
        </Box>
    )
}
