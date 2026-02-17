import React, { useCallback, useMemo } from "react";
import {
    Typography,
} from "@mui/material";

import BaseTableHeader from "../base";
import StatesMultiSelect from "./stateSelect";


function StateTableHeader(
    { 
        states,
        disabled, 
        isAllSelected,
        setIsAllSelected,
        selectedFilter,
        setSelectedFilter,
    }
) {
    const selectedIds = useMemo(() => {
        if (isAllSelected) {
            return states.map((s) => s.id);
        } else {
            return selectedFilter;
        } 
    }, [states, isAllSelected, selectedFilter]);

    const onChange = useCallback((ids) => {
        if (ids.length === states.length) {
            setIsAllSelected(true);
            setSelectedFilter([]);
        } else {
            setIsAllSelected(false);
            setSelectedFilter(ids);
        }
    }, [setIsAllSelected, setSelectedFilter, states]);


    return (
        <BaseTableHeader
            name={"Статус"}
            disabled={disabled}
            enabled={!isAllSelected}
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
            <StatesMultiSelect
                options={states}
                value={selectedIds}
                onChange={onChange}
            />
        </BaseTableHeader>
    )
}

export default StateTableHeader;