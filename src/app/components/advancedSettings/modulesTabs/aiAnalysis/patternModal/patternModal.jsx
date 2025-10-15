import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Box, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Divider, } from "@mui/material";

import ModalHeader from "./modalHeader";
import PatternName from "./patternName";
import Prompt from "./prompt";
import ModelSelect from "./modelSelect";
import { AnswerType, AnswerTypeSettings } from "./answerType";
import RunSalesbot from "./runSalesbot";
import { FieldRelation } from "./fieldRelation";
import { AttachTags } from "./attachTags";


export default function PatternModal({
    pattern,
    isModalOpen,
    handleClose,
    onProcess,
    isProcessing,
    headerName, 
    actionName,
    availableModels,
    availableAnswerTypes,
}) {
    const [patternName, setPatternName] = useState(pattern?.name);
    const [AIModel, setAIModel] = useState(pattern?.prompt?.ai_model);
    const [prompt, setPrompt] = useState(pattern?.prompt?.text)
    const [answerType, setAnswerType] = useState(pattern?.prompt?.answer_type);
    const [answerTypeSettings, setAnswerTypeSettings] = useState(pattern?.prompt?.answer_type_settings || {});

    const [runSalesbot, setRunSalesbot] = useState(pattern?.run_salesbot.state || false);
    const [salesbotId, setSalesbotId] = useState(pattern?.run_salesbot.id || null);    

    const [recordAnswerInField, setRecordAnswerInField] = useState(pattern?.crm_field?.state || false)
    const [relatedFieldId, setRelatedFieldId] = useState(pattern?.crm_field?.field_id || null);
    const [relatedFieldEntity, setRelatedFieldEntity] = useState(pattern?.crm_field?.entity);

    const [attachTags, setAttachTags] = useState(pattern?.tags?.state || false);
    const [tags, setTags] = useState(pattern?.tags?.list || []);
    const [tagsEntity, setTagsEntity] = useState(pattern?.tags?.entity);


    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            sx={{
                display: "grid",
                placeItems: "center",
                p: 2,
                outline: "none",
            }}
        >
            <Box
                sx={{
                    width: "min(960px, 90vw)",
                    maxHeight: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    border: "1px solid var(--palette-border-primary)",
                    background: "var(--palette-background-primary)",
                    boxSizing: "border-box",
                    borderRadius: 0,
                    boxShadow: 24,    

                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--palette-border-default)",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "var(--palette-border-primary)",
                    },

                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--palette-border-default) transparent",
                }}
            >
                <ModalHeader handleClose={handleClose} headerName={headerName} />
                <PatternName patternName={patternName} setPatternName={setPatternName} />
                <Box
                    sx={{
                        boxSizing: "border-box",
                        display: "flex",
                        p: "0.5rem 0.8rem",
                        pb: "1rem",
                        gap: "1rem",
                        borderBottom: "1px solid var(--palette-border-primary)"
                    }}
                >
                    <Prompt prompt={prompt} setPrompt={setPrompt} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "30%",
                            gap: "1.1rem",
                        }}
                    >
                        <ModelSelect 
                            availableModels={availableModels} 
                            AIModel={AIModel}
                            setAIModel={setAIModel}
                        />
                        <AnswerType
                            availableAnswerTypes={availableAnswerTypes}
                            answerType={answerType}
                            setAnswerType={setAnswerType}
                        />
                        <AnswerTypeSettings 
                            answerType={answerType}
                            answerTypeSettings={answerTypeSettings}
                            setAnswerTypeSettings={setAnswerTypeSettings}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        p: "0.5rem 0.8rem",
                        boxSizing: "border-box",
                    }}
                >
                    <FieldRelation 
                        isEnabled={recordAnswerInField}
                        setIsEnabled={setRecordAnswerInField}
                        relatedFieldId={relatedFieldId}
                        setRelatedFieldId={setRelatedFieldId}
                        entity={relatedFieldEntity}
                        setEntity={setRelatedFieldEntity}
                        availableAnswerTypes={availableAnswerTypes}
                        answerType={answerType}
                    />
                </Box>
                <Box
                    sx={{
                        p: "0.5rem 0.8rem",
                        boxSizing: "border-box",
                    }}
                >
                    <AttachTags 
                        isEnabled={attachTags}
                        setIsEnabled={setAttachTags}
                        tags={tags}
                        setTags={setTags}
                        entity={tagsEntity}
                        setEntity={setTagsEntity}
                    />
                </Box>
                <Box
                    sx={{
                        p: "0.5rem 0.8rem",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <RunSalesbot 
                        runSalesbot={runSalesbot}
                        setRunSalesbot={setRunSalesbot}
                        salesbotId={salesbotId}
                        setSalesbotId={setSalesbotId}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        p: "0.5rem 0.8rem",
                        boxSizing: "border-box",
                    }}
                >
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
                        onClick={onProcess}
                        disabled={isProcessing}
                    >
                        <span>{actionName}</span>
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

