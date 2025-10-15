import React, { useCallback, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PatternModal from "./patternModal/patternModal";


export default function Pattern(
    { 
        pattern, 
        availableModels,
        availableAnswerTypes,
        isLast = false,
    }
) {
    const [isEnabled, setIsEnabled] = useState(pattern.state);
    const [isSwitcherDisabled, setIsSwitcherDisabled] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);


    const onPatternEdit = useCallback(() => {
        setIsEditing(true);
    }, []);



    const handlePatternSwitch = useCallback(async (newState) => {
        try {
            setIsSwitcherDisabled(true);

            setIsEnabled(newState);
            console.log("switcher new state ", newState);
        
        } catch (error) {
            console.error(error);
        } finally {
            setIsSwitcherDisabled(false);
        }
        
    });  


    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    py: "1rem",
                    borderBottom: `1px solid ${isLast? "transparent" : "var(--palette-border-primary)}"}`,
                    alignItems: "center",
                }}
            >  
                <Box
                    sx={{
                        width: "15%",
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <PatternSwitcher 
                        patternId={pattern.id}
                        state={isEnabled} 
                        setState={handlePatternSwitch} 
                        disabled={isSwitcherDisabled}
                    />
                </Box>
                <Box
                    sx={{
                        width: "50%",
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <PatternName name={pattern.name} />
                </Box>
                <Box
                    sx={{
                        width: "5%",
                        boxSizing: "border-box",
                        ml: "auto",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <EditPattern disabled={isEditing} onClick={onPatternEdit}/>
                </Box>
            
            </Box>
            <PatternModal
                pattern={pattern}
                isModalOpen={isEditing}
                handleClose={() => {setIsEditing(false)}}
                handleProcess={() => {}}
                headerName="Редактирование шаблона"
                actionName="Сохранить"
                availableModels={availableModels}
                availableAnswerTypes={availableAnswerTypes}
            />
        </> 
    );
} 


function PatternSwitcher({patternId, state, setState, disabled}) {
    const sizeRem = 1;
    
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                display: "flex", 
                justifyContent: "flex-start",
                px: "2rem",
            }}
        >
            <input 
                type="checkbox" 
                style={{display: "none"}} 
                id={`pattern_switcher_${patternId}`} 
                onChange={async (e) => {setState(e.target.checked)}} 
                checked={state}
                disabled={disabled}
            />
            <label 
                htmlFor={`pattern_switcher_${patternId}`} 
                style={{
                    display: "flex", 
                    flexDirection: `${state? "row-reverse": "row"}`,
                    cursor: "pointer",
                }}
            >
                <Box
                    sx={{
                        border: `1px solid ${state? "var(--button_blue)" : "var(--palette-border-default)" }`,
                        borderRadius: "50%",
                        width: `${sizeRem}rem`,
                        height: `${sizeRem}rem`,
                        backgroundColor: `${state? "var(--button_blue)" :  "transparent"}`,
                    }}
                >
                </Box>
                <Box
                    sx={{
                        borderBottom: "1px solid var(--palette-border-default)",
                        width: `${sizeRem * 0.75}rem`,
                        height: `${sizeRem * 0.5}rem`,
                    }}
                >
                </Box>
            </label>
        </Box>
    )
}


function PatternName({ name }) {
    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    lineHeight: 1,
                    letterSpacing: "0.00938em",
                }}
            >
                {name}
            </Typography>
        </Box>
    )
}


function EditPattern({disabled, onClick}) {
    return (
        <Button
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
                cursor: "pointer",
                p: "0.25rem 0.5rem",
                m: 0,
                minWidth: 0,
                color: disabled? "var(--palette-text-secondary-dark-green)" : "var(--button_blue)",
            }}
            title="Редактировать шаблон"
            onClick={onClick}
        >           
            <EditIcon sx={{fontSize: "1.25rem"}} />
        </Button>
    );
}