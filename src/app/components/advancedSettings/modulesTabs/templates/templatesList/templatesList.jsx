import React from "react";
import { Box, Typography } from "@mui/material";

import TemplatesListItem from "./templatesListItem";


export default function TemplatesList({ templates }) {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                width: "100%",
                background: templates.length? "var(--palette-background-primary)" : "transparent",
            }}
        >   
            
            {   templates.length? 
                    templates.map((template, index) => (
                        <TemplatesListItem 
                            template={template} 
                            key={index} 
                            isLast={index === (templates.length - 1)} 
                        />
                    ))
                :
                    <Typography 
                        sx={{
                            color: "var(--palette-text-secondary-dark-green)",
                            py: "1rem",
                        }}
                    >
                        Нет ни одного шаблона
                    </Typography>
            }
        </Box>
    );

}
