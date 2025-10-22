import React from "react";
import { Skeleton, Box } from "@mui/material";


export default function ServicesLoading() {
    const sizes = {
        0: "75%",
        1: "15rem",
        2: "100%",
    };

    return (
        <>
            <Box
                sx={{
                    boxSizing: "border-box",
                    width: "100%",
                    display: "grid",
                    gap: "1px",
                    gridTemplateColumns: "20fr 55fr 25fr",
                    backgroundColor: "var(--palette-border-primary)",
                }}
            >
                <TableHeaderCell />
                <TableHeaderCell />
                <TableHeaderCell />
                
                {
                    Array.from({ length: 3 * 3 }).map((_, i) => (
                        <TableCell width={sizes[i % 3] || "100%"} key={i} />
                    ))
                }            
            </Box>
            <AddButton />       
        </>
    )
}



function TableHeaderCell({}) {
    return (
        <Box
            sx={{
                backgroundColor: "var(--palette-background-primary)",
                p: "1rem",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center"
            }}
        >
            <Skeleton variant="rounded" animation="wave" width="15rem" height="1.5rem" />
        </Box>
    )
}


function TableCell({ width }) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                width: "100%",
                backgroundColor: "var(--palette-background-primary)",
                p: "0.75rem 1rem",
            }}
        >   
            <Skeleton variant="rounded" animation="wave" width={width} height="1.5rem" />
        </Box>
    )
}
    
function AddButton({}) {
    return (
        <Box
            sx={{
                background: "var(--palette-background-primary)",
                borderRadius: "4px",
                p: "4px 10px",
                width: "fit-content",
                mt: "0.75rem",
                height: "30px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Skeleton variant="rounded" animation="wave" width={"12ch"} height="1rem" />
        </Box>
    )
    
}

