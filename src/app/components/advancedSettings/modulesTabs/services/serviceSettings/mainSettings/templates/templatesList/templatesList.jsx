import React from "react";
import { Box, Typography } from "@mui/material";

import TemplatesListItem from "./templatesListItem";


export default function TemplatesList({ templates, onEditTemplate, serviceChannels, serviceType }) {

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
                            isFirst={index === 0} 
                            isLast={index === (templates.length - 1)}
                            onEditTemplate={onEditTemplate}
                            serviceChannels={serviceChannels}
                            serviceType={serviceType}
                        />
                    ))
                :
                    <Typography 
                        sx={{
                            color: "var(--palette-text-secondary-dark-green)",
                            p: "1rem",
                            alignSelf: "center",
                            textAlign: "center",
                            fontStyle: "italic",
                            fontSize: "0.8125rem",
                        }}
                    >
                        Нет добавленных шаблонов
                    </Typography>
            }
        </Box>
    );

}
