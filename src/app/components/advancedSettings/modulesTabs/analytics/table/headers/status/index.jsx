import React, { useMemo, useCallback } from "react";
import {
    Typography,
} from "@mui/material";
import BaseTableHeader from "../base";
import StatusesMultiSelect from "./statusesSelect";


function StatusTableHeader(
    { 
        pipelinesStatuses, 
        disabled,
        isAllSelected,
        setIsAllSelected,
        selectedFilter,
        setSelectedFilter,
    }
) {
    const selectedIds = useMemo(() => {
        if (isAllSelected) {
            const statuses = pipelinesStatuses?.statuses || {};
            return Object.keys(statuses);
        }
        return selectedFilter;
    }, [pipelinesStatuses, isAllSelected, selectedFilter]);
    
    const onChange = useCallback((ids) => {
        const total = Object.keys(pipelinesStatuses?.statuses || {}).length;
        if (ids.length === total) {
            setIsAllSelected(true);
            setSelectedFilter([]);
        } else {
            setIsAllSelected(false);
            setSelectedFilter(ids);
        }
    }, [setIsAllSelected, setSelectedFilter, pipelinesStatuses]);
    

    const options = useMemo(() => {
        if ( !pipelinesStatuses || !pipelinesStatuses?.statuses ) {
            return [];
        }

        const opts = [];

        for (const [statusId, statusData] of Object.entries(pipelinesStatuses.statuses)) {
            opts.push(
                {
                    id: statusId,
                    name: `${pipelinesStatuses.pipelines[statusData.pipelineId].name} — ${statusData.name}`,
                }
            )
        }

        const ids = [];
        opts.forEach(o => {ids.push(o.id)}); 

        return opts;
    }, [pipelinesStatuses]);


    return (
        <BaseTableHeader
            name={"Этап"}
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

            <StatusesMultiSelect
                label="Этапы"
                options={options}
                value={selectedIds}
                onChange={onChange}
            />
        </BaseTableHeader>
    )
}

export default StatusTableHeader;