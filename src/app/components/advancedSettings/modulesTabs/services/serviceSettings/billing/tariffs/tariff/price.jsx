import React from "react";
import { Typography } from "@mui/material";


export default function Price({ value }) {
    return (
        <Typography
            sx={{
                fontSize: "26px",
                fontWeight: 600,
            }}
        >
            {value}
        </Typography>
    )
}