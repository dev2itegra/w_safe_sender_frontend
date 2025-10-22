import React, { useCallback, useEffect } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";

import styles from "./styles.module.scss";
import onRedirect from "./onRedirect";
import { widgetCode } from "../../config";


export default function TemplateSelect({
    templates,
    selectedTemplate,
    setSelectedTemplate,
}) {
    const processTemplateSelecting = useCallback((templateId) => {
        setSelectedTemplate(templateId);
    }, [setSelectedTemplate]);

    // If the selected template no longer exists, fallback to "__unselected__"
    useEffect(() => {
        const exists = Array.isArray(templates)
            && templates.some((t) => String(t.id) === String(selectedTemplate));

        if (!exists && selectedTemplate !== "__unselected__") {
            setSelectedTemplate("__unselected__");
        }
    }, [templates, selectedTemplate, setSelectedTemplate]);

    return (
        <Box sx={{ boxSizing: "border-box", py: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <label htmlFor="template_id" className={clsx(styles.fieldTitle)}>
                    Шаблон рассылки
                </label>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div className={clsx(styles.templateSelectWrapper)}>
                    <select
                        id="template_id"
                        value={selectedTemplate}
                        onChange={(e) => processTemplateSelecting(e.target.value)}
                        className={clsx(
                            styles.templateSelect,
                            selectedTemplate === "__unselected__" ? styles.templateSelectUnselected : ""
                        )}
                    >
                        <option value="__unselected__">Шаблон не выбран</option>
                        {templates.map((t) => (
                            <option key={t.id} value={String(t.id)}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <span className={clsx(styles.orItem)}>или</span>

                <Button
                    sx={{
                        color: "#2f80ed",
                        border: "1px solid currentColor",
                        textTransform: "none",
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 400,
                        width: "40%",
                        borderRadius: "3px",
                        fontFamily: "PT Sans, Arial, sans-serif",
                        fontSize: "1rem",
                        p: "0 11px",
                        height: "36px",
                    }}
                    onClick={() => { onRedirect(`/settings/widgets/${widgetCode}/`); }}
                >
                    <AddIcon sx={{ fontSize: 22 }} />
                    <span>Создать шаблон</span>
                </Button>
            </Box>

            {
                selectedTemplate === "__unselected__" &&
                <span className={clsx(styles.unselectedWarning)}>Выберите шаблон рассылки</span>
            }
        </Box>
    );
}
