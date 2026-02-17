import React from "react";
import { Box, Typography } from "@mui/material";
import { I18nProvider } from 'react-aria-components';

import BaseTableHeader from "../base";
import RangePicker from "./rangePicker";


function DateRangeTableHeader(
    { 
        name, 
        disabled,
        fromValue,
        setFromValue,
        tillValue,
        setTillValue,
    }
) {
    return (
        <BaseTableHeader 
            name={name} 
            disabled={disabled} 
            enabled={fromValue || tillValue}
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
            
            <RangePicker 
                start={fromValue}
                setStart={setFromValue}
                end={tillValue}
                setEnd={setTillValue}
            />
        </BaseTableHeader>
    );
}

export default DateRangeTableHeader;