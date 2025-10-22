import { Box, Typography, Button } from "@mui/material";
import React from "react";

export default function ServiceName({ name, onClick, serviceId }) {
    return (
        <Button
            sx={{
                boxSizing: "border-box",
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                border: "none",
                background: "transparent",
                color: "var(--button_blue)",
                letterSpacing: "0.01071em",
                p: 0,
                overflow: "hidden",
                font: "inherit",
                fontWeight: 500,
                justifyContent: "flex-start",
                textAlign: "left",
            }}
            onClick={() => onClick(serviceId)}
            title={name}
        >
            <Typography
                component="span"
                noWrap
                sx={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                }}
            >
                {name}
            </Typography>
        </Button>
    );
}
