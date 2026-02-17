import React, { useState } from "react";
import { Box } from "@mui/material";
import AnalyticsTable from "./table";



export default function Analytics({}) {
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AnalyticsTable />
        </Box>
    )
}