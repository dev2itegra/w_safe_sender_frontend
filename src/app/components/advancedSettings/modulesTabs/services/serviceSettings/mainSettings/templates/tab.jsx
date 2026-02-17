import React, { useState, useEffect, useCallback, } from "react";
import { Box } from "@mui/material";

import TabHeader from "./header";
import TemplatesList from "./templatesList/templatesList";


export default function Templates(
    { 
        serviceTemplates, 
        onCreateTemplate, 
        onEditTemplate,
        serviceChannels,
        serviceType,
    }
) {


    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <TabHeader 
                onCreateTemplate={onCreateTemplate}
                serviceChannels={serviceChannels}    
                serviceType={serviceType}
            />
            <TemplatesList
                templates={serviceTemplates} 
                onEditTemplate={onEditTemplate}
                serviceChannels={serviceChannels}
                serviceType={serviceType}
            />
        </Box>
    )
}