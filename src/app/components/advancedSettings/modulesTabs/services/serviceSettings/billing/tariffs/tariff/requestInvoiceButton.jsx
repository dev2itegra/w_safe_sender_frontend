import React from "react";
import { Button } from "@mui/material";


export default function RequestInvoiceButton({ onClick }) {
    return (
        <Button
            sx={{
                width: "100%",
                fontSize: "10px",
                color: "var(--button_blue)",
            }}
            onClick={onClick}
        >
            Запросить счёт
        </Button>
    )
}