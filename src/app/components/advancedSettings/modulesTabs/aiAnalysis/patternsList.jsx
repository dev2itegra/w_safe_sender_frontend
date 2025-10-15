import React from "react";
import { Box, Typography } from "@mui/material";

import Pattern from "./pattern";


export default function PatternsList({ patterns, availableModels, availableAnswerTypes }) {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                width: "100%",
                background: patterns.length? "var(--palette-background-primary)" : "transparent",
            }}
        >   
            
            {   patterns.length? 
                    patterns.map((pattern, index) => (
                        <Pattern 
                            pattern={pattern} 
                            key={index} 
                            isLast={index === (patterns.length - 1)} 
                            availableModels={availableModels}
                            availableAnswerTypes={availableAnswerTypes}
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
