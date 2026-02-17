import React, { useCallback, useMemo } from "react";
import {
    Typography,
} from "@mui/material";
import BaseTableHeader from "../base";
import TemplateMultiSelect from "./templatesSelect";



function TemplateTableHeader(
    { 
        templates,
        disabled,
        isAllSelected,
        setIsAllSelected,
        selectedFilter,
        setSelectedFilter,
    }
) {
    const selectedIds = useMemo(() => {
        if (isAllSelected) {
            return templates.map((t) => t.id);
        } else {
            return selectedFilter;
        }
    }, [templates, isAllSelected, selectedFilter]);

    const onChange = useCallback((ids) => {
        if (ids.length === templates.length) {
            setIsAllSelected(true);
            setSelectedFilter([]);
        } else {
            setIsAllSelected(false);
            setSelectedFilter(ids);
        }
    }, [setIsAllSelected, setSelectedFilter, templates]);


    return (
        <BaseTableHeader
            name={"Шаблон"}
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
            <TemplateMultiSelect
                label="Шаблоны"
                options={templates}
                value={selectedIds}
                onChange={onChange}
            />
        </BaseTableHeader>
    )
}

export default TemplateTableHeader;