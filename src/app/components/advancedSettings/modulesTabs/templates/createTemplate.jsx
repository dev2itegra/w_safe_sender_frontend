import React, {useState, useCallback} from "react";
import { Button } from "@mui/material";


export function CreateTemplateButton({}) {
    const [isTemplateCreating, setIsTemplateCreating] = useState(false);

    const onCreateTemplate = useCallback(
        () => {

        }, []
    )

    
    return (
        <Button
            sx={{
                width: "fit-content",
                ml: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
                boxSizing: "border-box",
                background: "var(--button_blue)",
                color: "white",
                px: "2.5rem",
                transition: "opacity 0.1s ease-in-out",
                "&:hover": { opacity: 0.85 },
                "&:disabled" : { opacity: 0.85 },
            }}
            onClick={onCreateTemplate}
            disabled={isTemplateCreating}
        >
            <span>Добавить шаблон</span>
        </Button>
    ) 
}