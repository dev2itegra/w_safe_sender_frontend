import React from "react";
import { Box, Skeleton } from "@mui/material";
import clsx from "clsx";

import styles from "./table.module.scss";


export function ResultsLoading({ rowsNumber = 20 }) {
    const rowsList = [];
    for (let index = 0; index < rowsNumber; index++) {
        rowsList.push(index);
    }
    

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    width: "100%",
                }}
            >   
                <MetricLoading />
                <MetricLoading />
                <MetricLoading />
                <MetricLoading />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--palette-background-primary)",
                }}
            >
                <table 
                    style={{
                        width: "100%",
                    }}
                >
                    <thead>
                        <tr className={clsx(styles.row)}>
                            <th>
                                <Skeleton animation={"wave"} variant="rounded" width={"6.5rem"} height={"1rem"} />
                            </th>
                            <th>
                                <Skeleton animation={"wave"} variant="rounded" width={"12rem"} height={"1rem"} />
                            </th>
                            <th>
                                <Skeleton animation={"wave"} variant="rounded" width={"5rem"} height={"1rem"} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rowsList.map((i) => (
                                <tr key={i} className={clsx(styles.row)}>
                                    <td>
                                        <Skeleton animation={"wave"} variant="rounded" width={"12rem"} height={"1rem"} />
                                    </td>
                                    <td>
                                        <Skeleton animation={"wave"} variant="rounded" width={"8rem"} height={"1rem"} />
                                    </td>   
                                    <td>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.25rem",
                                                width: "100%",
                                            }}
                                        >
                                            <Skeleton animation={"wave"} variant="rounded" width={"20rem"} height={"1.2rem"} />
                                            <Box 
                                                sx={{
                                                    marginLeft: "auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <Skeleton animation={"wave"} variant="rounded" width={"5rem"} />
                                            </Box>
                                        </Box>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Box>
        </Box>
    )
}


function MetricLoading() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
                p: "0.5rem",
                width: "fit-content",
                background: "var(--palette-background-primary)",
            }}
        >
                <Box
                    sx={{
                        display: "flex",
                        px: "0.2rem",
                        alignItems: "center",
                    }}
                >
                    <Skeleton animation={"wave"} variant="circular" width={"2rem"} height={"2rem"} />
                </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    gap: "0.2rem",
                }}
            >
                <Skeleton animation={"wave"} variant="rounded" width={"5rem"} height={"1rem" } />
                <Skeleton animation={"wave"} variant="rounded" width={"10rem"} height={"0.7rem" } />
            </Box>
        </Box>
    )
}