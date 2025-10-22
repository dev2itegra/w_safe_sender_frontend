import React from "react";
import { Skeleton, Box } from "@mui/material";


export default function ServicesSettingsLoading() {
    return (
        <>
            <Box
                sx={{
                    boxSizing: "border-box",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Header />
                <Switcher />
                <ApiKeyBlock />
                <TemplatesBlock />
            </Box>     
        </>
    )
}



function Header({}) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
                p: "1.25rem",
                background: "var(--palette-background-primary)",
            }}
        >
            <Skeleton variant="rounded" animation="wave" width="7rem" height="1rem" />
            <Skeleton variant="rounded" animation="wave" width="25rem" height="2.5rem" />
        </Box>
    )
}


function Switcher({}) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                background: "var(--palette-background-primary)",
                display: "grid",
                gridTemplateColumns: `repeat(2, 1fr)`,
            }}
        >
            <SwitcherTab size={"25rem"}/>
            <SwitcherTab size={"25rem"}/>
        </Box>
    )
}


function SwitcherTab({size}) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                background: "transparent",
                py: "0.75rem",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Skeleton variant="rounded" animation="wave" width={size} height="1.75rem" />     
        </Box>
    )
}


function ApiKeyBlock() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                background: "var(--palette-background-primary)",
                p: "1.25rem",
                boxSizing: "border-box",
            }}
        >
            <Skeleton variant="rounded" animation="wave" width={"10rem"} height="1.75rem" />
            <Skeleton variant="rounded" animation="wave" width={"15rem"} height="1rem" />
            <Box
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid var(--palette-border-default)",
                    borderRadius: "4px",
                    padding: "16.5px 14px",
                }}
            >
                <Skeleton variant="rounded" animation="wave" width={"50ch"} height="1.5rem" />
            </Box>
        </Box>
    )
}


function TemplatesBlock() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                background: "var(--palette-background-primary)",
                boxSizing: "border-box",
            }}
        >   
            <Box
                sx={{
                    display: "flex",
                    boxSizing: "border-box",
                    p: "1.25rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                        boxSizing: "border-box",
                    }}
                >
                    <Skeleton variant="rounded" animation="wave" width={"10rem"} height="1.75rem" />
                    <Skeleton variant="rounded" animation="wave" width={"25rem"} height="1rem" />
                </Box>
                <Box sx={{ml: "auto"}} >
                    <Skeleton variant="rounded" animation="wave" width={"15ch"} height="1.5rem" />
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <TemplatesElement isFirst={true} isLast={false} />
                <TemplatesElement isFirst={false} isLast={false} />
                <TemplatesElement isFirst={false} isLast={false} />
                <TemplatesElement isFirst={false} isLast={false} />
                <TemplatesElement isFirst={false} isLast={true} />
            </Box>
        </Box>
    )    
}


function TemplatesElement({isFirst, isLast}) {
    return (
        <Box
            sx={{
                width: "100%",
                py: "1rem",
                borderTop: `1px solid ${isFirst? "var(--palette-border-primary)" : "transparent"}`,
                borderBottom: `1px solid ${isLast? "transparent" : "var(--palette-border-primary)"}`,
                display: "grid",
                gridTemplateColumns: "5% 15% 50% auto",
                boxSizing: "border-box",
                p: "1.25rem",
            }}
        >
            <TemplatesElementCell size={"1.5rem"} />
            <TemplatesElementCell size={"80%"} />
            <TemplatesElementCell size={"35rem"} />
            <Box sx={{ml: "auto", display: "flex", alignItems: "ceneter"}} >
                <TemplatesElementCell size={"1.5rem"} />
            </Box>
        </Box>
    )
}

function TemplatesElementCell({size}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
            }}
        >
            <Skeleton variant="rounded" animation="wave" width={size} height="1.5rem" />
        </Box>
    )
}