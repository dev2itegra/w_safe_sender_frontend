import React from "react";
import { Typography } from "@mui/material";


export default function Duration({ value }) {
    return (
        <Typography
            component={"span"}
        >
            {value}
        </Typography>
    )
}