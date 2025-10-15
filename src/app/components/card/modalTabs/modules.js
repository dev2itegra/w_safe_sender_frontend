import React from "react";

import { TranscriptionTab } from "./transcriptionTab/transcriptionTab";
import { AnalysisTab } from "./analysisTab/analysisTab";


export const modules = [
    {
        name: "Транскрибация",
        content: TranscriptionTab,
        render: (ctx) => <TranscriptionTab {...ctx.transcription} />
    },
    {
        name: "ИИ анализ (скоро)",
        isDisabled: true,
        render: (ctx) => <AnalysisTab {...ctx.analysis} />
    },
];