import React, { useEffect, useState } from "react";
import { Skeleton, Box, Button, Avatar } from "@mui/material";


export function LoadingBlock() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
            }}
        >   
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "20px",
                    mb: "1.5rem",
                }}
            >
                <Skeleton variant="text" animation="wave" width="105px" height="60px" sx={{ fontSize: "3rem" }} />
                <Skeleton variant="text" animation="wave" width="105px" height="60px" sx={{ fontSize: "3rem" }} />
                <Skeleton variant="text" animation="wave" width="105px" height="60px" sx={{ fontSize: "3rem" }} />
                <Skeleton variant="text" animation="wave" width="105px" height="60px" sx={{ fontSize: "3rem" }} />
            </Box>
            <Box 
                sx={{
                    display: "grid",
                    gridTemplateColumns: "6fr 4fr",
                    gap: "1rem",
                }}
            >   
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.8rem",
                        padding: "1rem",
                        boxSizing: "border-box",
                        backgroundColor: "var(--palette-background-primary)",
                        borderRadius: "0.2rem",
                    }}    
                >
                    <Skeleton variant="text" animation="wave" width="100%" sx={{fontSize: "2rem"}}/>
                    <Box sx={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                        <Skeleton variant="rounded" animation="wave" height="1.5rem" width="1.5rem" />
                        <Skeleton variant="text" animation="wave" width="400px" sx={{fontSize: "2rem"}}/>
                    </Box>
                    <Box sx={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                        <Skeleton variant="rounded" animation="wave" height="1.5rem" width="1.5rem" />
                        <Skeleton variant="text" animation="wave" width="400px" sx={{fontSize: "2rem"}}/>
                    </Box>
                </Box>
				<Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.3rem",
                        padding: "1rem",
                        boxSizing: "border-box",
                        backgroundColor: "var(--palette-background-primary)",
                        borderRadius: "0.2rem",
                    }}    
                >
                    <Skeleton variant="text" animation="wave" width="100%" sx={{fontSize: "2rem"}}/>
					<Box 
						sx={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							gap: "0.1rem",
							boxSizing: "border-box",
						}}
					>
						<Skeleton variant="text" animation="wave" width={"20ch"} sx={{fontSize: "1.5rem"}}/>
						<Skeleton variant="rounded" animation="wave" height={"1.5rem"} width="100%" />
						<Skeleton variant="text" animation="wave" width="17ch" sx={{fontSize: "1.5rem"}}/>
					</Box>
					<Skeleton variant="text" animation="wave" width="30ch" sx={{fontSize: "2rem"}}/>
                </Box>
            </Box>
        </Box>
    )
}
