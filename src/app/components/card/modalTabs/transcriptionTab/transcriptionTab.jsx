import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { TranscriptionTaskStatus } from "../../../../enums/transcriptionTaskStatus";
import { CallTranscription } from "./callTranscription/callTranscription";
import { NotTranscriptedCall } from "./notTranscriptedCall";
import { tabsCtx } from "../ctx"; 


export function TranscriptionTab({
    callEventId,
    callNoteId,
    tData,
    eventData,
    noteData,
    onClickOnMessage = undefined,
    entityType,
}) {
    const [transcriptionData, setTranscriptionData] = useState(tData);

    const search = tabsCtx?.transcription?.search || {};
    const query = search.query || "";
    const matchesByChunk = search.matchesByChunk || new Map();
    const activeIdx = typeof search.activeIdx === "number" ? search.activeIdx : -1;

    return (
        <Box
            sx={{
                width: "100%",
                p: "0.5rem",
                boxSizing: "border-box",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {transcriptionData?.status === TranscriptionTaskStatus.PROCESSED ? (
                <CallTranscription
                    transcriptionData={transcriptionData}
                    onClickOnMessage={onClickOnMessage}
                    searchQuery={query}
                    matchesByChunk={matchesByChunk}
                    activeGlobalIndex={activeIdx}
                />
            ) : (
                <NotTranscriptedCall
                    transcriptionData={transcriptionData}
                    setTranscriptionData={setTranscriptionData}
                    callEventId={callEventId}
                    callNoteId={callNoteId}
                    entityType={entityType}
                />
            )}
        </Box>
    );
}



// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
// } from "@mui/material";

// import { TranscriptionTaskStatus } from "../../../../enums/transcriptionTaskStatus";
// import { CallTranscription } from "./callTranscription/callTranscription";
// import { NotTranscriptedCall } from "./notTranscriptedCall";

// export function TranscriptionTab(
//     { 
//         callEventId,
//         callNoteId,
//         tData,
//         eventData,
//         noteData,
//         onClickOnMessage = undefined,
//         entityType,
//     }
// ) {
//     const [transcriptionData, setTranscriptionData] = useState(tData);

    
//     return <>
//         <Box
//             sx={{
//                 width: "100%",
//                 p: "0.5rem",
//                 boxSizing: "border-box",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//             }}
//         >
//             {   transcriptionData?.status === TranscriptionTaskStatus.PROCESSED ?
//                     <CallTranscription 
//                         transcriptionData={transcriptionData} 
//                         onClickOnMessage={onClickOnMessage}    
//                     />
//                 : 
//                     <NotTranscriptedCall 
//                         transcriptionData={transcriptionData} 
//                         setTranscriptionData={setTranscriptionData}
//                         callEventId={callEventId} 
//                         callNoteId={callNoteId}
//                         entityType={entityType}
//                     /> 
//             }                                             
//         </Box>
//     </>
// }