import React from "react"
import { Button, Typography, Box } from "@mui/material"
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';


export default function ModalHeader({ handleClose, headerName }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                pt: "0.5rem",
                px: "0.8rem",
                pb: "1.25rem",
                gap: "1rem",
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
                <Button
                    sx={{
                        ml: "auto",
                        p: 0,
                        minWidth: 0,
                        fontSize: "1.5rem",
                        alignSelf: "flex-start",
                        justifyContent: "flex-end",
                        "&:hover": { backgroundColor: "transparent", boxShadow: "none", opacity: "0.75" },
                    }}
                    title="Перейти в инструкцию по настройке шаблона"
                >
                    <a
                        style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "var(--palette-border-default)",
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                            lineHeight: 1.75,
                        }}
                        href="https://integrator2.ru/widjety-amocrm-wasend"
                    >
                        <InfoOutlineIcon sx={{fontSize: "1.5rem"}} />
                    </a>   
                </Button>

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
