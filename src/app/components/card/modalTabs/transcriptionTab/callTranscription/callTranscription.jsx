import React, { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Message } from "./message";

function getScrollParent(node) {
    let el = node;
    while (el && el !== document.body) {
        const style = getComputedStyle(el);
        const oy = style.overflowY;
        const canScroll = (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
        if (canScroll) return el;
        el = el.parentElement;
    }
    // Fallback for document scrolling
    return document.scrollingElement || document.documentElement;
}

export function CallTranscription({
    transcriptionData,
    onClickOnMessage = undefined,
    searchQuery = "",
    matchesByChunk = new Map(),
    activeGlobalIndex = -1,
}) {
    const [speakersNames, setSpeakersNames] = useState({});

    // gidx -> HTMLElement
    const markRefs = useRef(new Map());
    const registerMark = useCallback((gidx, el) => {
        if (gidx < 0) return;
        if (el) markRefs.current.set(gidx, el);
        else markRefs.current.delete(gidx);
    }, []);

    useEffect(() => {
        const obj = {};
        const sp = transcriptionData?.transcription?.speakers || [];
        sp.forEach((speaker) => {
            obj[speaker.id] = {
                name: speaker.name,
                imageName: generateSpeakerImageText(speaker.name),
            };
        });
        setSpeakersNames(obj);
    }, [transcriptionData]);

    const generateSpeakerImageText = useCallback((name) => {
        const parts = String(name || "").trim().split(/\s+/).slice(0, 2);
        if (!parts.length) return "";
        return parts.map((p) => p[0]?.toUpperCase() || "").join("");
    }, []);

    const offsets = useMemo(() => {
        const res = [];
        let acc = 0;
        const chunks = transcriptionData?.transcription?.chunks || [];
        for (let i = 0; i < chunks.length; i++) {
            res[i] = acc;
            acc += (matchesByChunk.get(i)?.length || 0);
        }
        return res;
    }, [transcriptionData, matchesByChunk]);

    // Scroll active match into view (center) using its actual scrollable parent
    useLayoutEffect(() => {
        if (activeGlobalIndex < 0) return;
        const el = markRefs.current.get(activeGlobalIndex);
        if (!el) return;

        let cancelled = false;
        const raf = requestAnimationFrame(() => {
            if (cancelled) return;
            const container = getScrollParent(el);

            // Compute target top inside that container
            const cRect = container.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();
            const delta = (eRect.top - cRect.top) - (container.clientHeight / 2 - eRect.height / 2);

            // If the container is the document, scroll window
            if (container === document.scrollingElement || container === document.documentElement) {
                const nextTop = Math.max(0, window.scrollY + delta);
                if (Math.abs(delta) > 2) window.scrollTo({ top: nextTop, behavior: "smooth" });
                return;
            }

            // Regular element scrolling
            const nextTop = Math.max(0, container.scrollTop + delta);
            if (Math.abs(delta) > 2) {
                if (typeof container.scrollTo === "function") {
                    container.scrollTo({ top: nextTop, behavior: "smooth" });
                } else {
                    container.scrollTop = nextTop;
                }
            }
        });

        return () => { cancelled = true; cancelAnimationFrame(raf); };
    }, [activeGlobalIndex]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "0.25rem",
                    boxSizing: "border-box",
                    height: "100%",
                    flex: 1,
                    my: "1rem",
                    overflowY: "auto",
                }}
            >
                {(transcriptionData?.transcription?.chunks || []).map((chunk, index) => (
                    <Message
                        key={index}
                        text={chunk.text}
                        timing={chunk.time}
                        senderName={speakersNames[chunk.speaker]?.name}
                        imageText={speakersNames[chunk.speaker]?.imageName}
                        senderRepeatition={
                            index > 0 &&
                            transcriptionData.transcription.chunks[index - 1].speaker === chunk.speaker
                        }
                        isManager={false}
                        onClick={() => onClickOnMessage?.(chunk.time?.from ?? 0)}
                        highlights={matchesByChunk.get(index) || []}
                        messageGlobalOffset={offsets[index] || 0}
                        activeGlobalIndex={activeGlobalIndex}
                        registerMark={registerMark}
                    />
                ))}
            </Box>
        </Box>
    );
}