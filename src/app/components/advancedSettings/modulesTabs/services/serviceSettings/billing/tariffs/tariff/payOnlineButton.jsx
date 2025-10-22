import React from "react";
import { Button } from "@mui/material";


export default function PayOnlineButton({ onClick, isLoading }) {
    return (
        <Button
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxSizing: "border-box",
                WebkitTapHighlightColor: "transparent",
                cursor: "pointer",
                userSelect: "none",
                verticalAlign: "middle",
                appearance: "none",
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                lineHeight: 1.75,
                letterSpacing: "0.02857em",
                textTransform: "uppercase",
                minWidth: "64px",
                boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, " +
                    "rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, " +
                    "rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
                color: "rgba(0, 0, 0, 0.87)",
                backgroundColor: "white",
                outline: 0,
                borderWidth: 0,
                borderStyle: "none",
                margin: 0,
                textDecoration: "none",
                padding: "6px 16px",
                borderRadius: "4px",
                transition:
                    "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                    "color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    backgroundColor: "#f5f5f5",
                    boxShadow:
                        "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, " +
                        "rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, " +
                        "rgba(0, 0, 0, 0.12) 0px 1px 10px 0px",
                },
                "&:disabled": {
                    opacity: 0.7,
                    cursor: "default",
                    boxShadow: "none",
                },
                width: "100%",
            }}
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? "Инициализация..." : "Оплатить онлайн"}
        </Button>
    );
}
