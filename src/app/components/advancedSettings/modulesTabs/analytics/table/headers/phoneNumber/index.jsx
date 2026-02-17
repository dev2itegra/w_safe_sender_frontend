import React, { useEffect, useMemo, useState } from "react";
import {
    TableCell,
    Popover,
    Box,
    Typography,
    Checkbox,
    Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import BaseTableHeader from "../base";
import PhoneNumberInput from "./input";


function PhoneNumberTableHeader(
    { 
        disabled,
        phoneNumber,
        setPhoneNumber,
    }
) {
    return (
        <BaseTableHeader
            name={"Номер телефона"}
            disabled={disabled}
            enabled={!!phoneNumber}
        >
            <Typography
                sx={{
                    fontSize: "0.8125rem",
                    color: "var(--palette-text-secondary-light)",
                    mb: "1rem",
                }}
            >
                Фильтр
            </Typography>
            
            <PhoneNumberInput 
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
            />
        </BaseTableHeader>
    )
}

export default PhoneNumberTableHeader;