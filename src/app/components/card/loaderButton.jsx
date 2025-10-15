import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
    Button,
    CircularProgress,
    Modal,
    Box,
    Typography,
    Backdrop,
} from "@mui/material";
import clsx from "clsx";

import styles from "./transcription.module.scss";
import { baseApiInstance } from "../../services/requests/axios.instance.js";
import { amoApiInstance } from "../../services/requests/amoAPI.js";
import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification.js";
import { useThemeDetector } from "../../services/themes/themeDetector.js";
import { CallPlayer } from "./callPlayer.jsx";
import { calculateDuration, formatDurationTime } from "./durationCalculating.js";
import { ModalTabs } from "./modalTabs/modalTabs.jsx";
import { tabsCtx } from "./modalTabs/ctx.js";
import { Searcher } from "./searcher.jsx";
import { findMatches } from "../../services/textSearch/textSearch";

const modalStyle = {
    width: "min(960px, 90vw)",
    maxHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid var(--palette-border-default)",
    background: "var(--palette-background-primary)",
    boxSizing: "border-box",
    borderRadius: 0,
    boxShadow: 24,
};

export function TranscriptionLoaderButton({
    widget,
    callEventId,
    fromLead = true,
    children,
    hidePhoneNumber = false,
    callEntityType = null,
    callEntityId = null,
}) {
    const theme = useThemeDetector();
    const playerRef = useRef(null);

    const wrapperRef = useRef(null);
    useEffect(() => {
        wrapperRef.current = document.querySelector(
            `.feed-note-wrapper-call_in_out[data-id="${callEventId}"]`
        );
    }, [callEventId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTranscriptionLoading, setIsTranscriptionLoading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [callType, setCallType] = useState(null);
    const [callName, setCallName] = useState(null);
    const [callTimingText, setCallTimingText] = useState(null);
    const [audioLink, setAudioLink] = useState(null);

    const [entityId, setEntityId] = useState(callEntityId);
    const [entityType, setEntityType] = useState(callEntityType);
    const [entityHref, setEntityHref] = useState(null);
    const [entityName, setEntityName] = useState("Не определено");

    const [tData, setTData] = useState(null);

    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        if (isModalOpen) el.dataset.s2tModalOpen = "1";
        else delete el.dataset.s2tModalOpen;
        return () => { if (el) delete el.dataset.s2tModalOpen; };
    }, [isModalOpen]);

    const handleMessageClick = useCallback((fromSec) => {
        playerRef.current?.seek?.(fromSec);
    }, []);
    tabsCtx.transcription.onClickOnMessage = handleMessageClick;

    const handleClose = () => setIsModalOpen(false);

    const loadEventData = async (id) => {
        const r = await baseApiInstance.get(`/amocrm/api/events/${id}`);
        return r.data.data;
    };

    const loadNoteData = async (noteId, entity) => {
        const r = await baseApiInstance.get(`/amocrm/api/${entity}/notes/${noteId}`);
        return r.data.data;
    };

    const handleSearchChange = useCallback((v) => {
        if (v !== query) {
            setQuery(v);
            setActiveIdx(0);
        }
    }, [query]);

    const loadTranscription = useCallback(async (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        try {
            if (isTranscriptionLoading) return;
            setIsTranscriptionLoading(true);

            let noteId;
            let entityTypeLocal = callEntityType;
            
            if (/^\d+$/.test(callEventId)) {
                tabsCtx.transcription.callEventId = null;
                noteId = parseInt(callEventId, 10);
                tabsCtx.transcription.entityType = entityTypeLocal;
                setEntityType(entityTypeLocal);
            } else {
                tabsCtx.transcription.callEventId = callEventId;
                const event = await loadEventData(callEventId);
                entityTypeLocal = event.entity_type;
                setEntityType(entityTypeLocal);
                tabsCtx.transcription.entityType = entityTypeLocal;
                noteId = event.value_after[0].note.id;
            }

            tabsCtx.transcription.callNoteId = noteId;
            const note = await loadNoteData(noteId, `${entityTypeLocal}s`);

            const getTranscriptionResponse = await baseApiInstance.get(`/transcriptions/${callEventId}/${noteId}`);
            const transcriptionData = getTranscriptionResponse.data;
            tabsCtx.transcription.tData = transcriptionData;
            setTData(transcriptionData);

            setEntityId(note.entity_id);
            setEntityHref(`/${entityTypeLocal}s/detail/${note.entity_id}`);

            const getEntityResponse = await baseApiInstance.get(`/amocrm/api/${entityTypeLocal}s/${note.entity_id}`);
            if (getEntityResponse.data.data.name) {
                setEntityName(getEntityResponse.data.data.name);
            }

            setDuration(note.params.duration);
            setCallType(note.note_type === "call_in" ? "incoming" : "outgoing");

            const responsibleManagerId = note.responsible_user_id;
            const getManagerResponse = await baseApiInstance.get(`/amocrm/api/users/${responsibleManagerId}`);
            const managerData = getManagerResponse.data.data;

            const calculatedDuration = calculateDuration(note.params.duration);
            setCallName(
                note.note_type === "call_in"
                    ? `${hidePhoneNumber ? getEntityResponse.data.data.name || entityName : note.params.phone} → ${managerData.name}`
                    : `${managerData.name} → ${hidePhoneNumber ? getEntityResponse.data.data.name || entityName : note.params.phone}`
            );
            setCallTimingText(
                `${formatDurationTime(
                    calculatedDuration.hours,
                    calculatedDuration.minutes,
                    calculatedDuration.seconds
                )}, ${formatDateTime(note.created_at, APP.constant("account").timezone)}`
            );
            setAudioLink(note.params.link);

            setQuery("");
            setActiveIdx(0);

            setIsModalOpen(true);
        } catch (error) {
            sendAmoErrorNotification("Ошибка при загрузке транскрибации");
            console.error("Error loading transcription:", error);
        } finally {
            setIsTranscriptionLoading(false);
        }
    }, [callEventId, isTranscriptionLoading, callEntityType, entityName, hidePhoneNumber]);

    const trigger = useMemo(() => {
        if (typeof children === "function") {
            return children({
                loading: isTranscriptionLoading,
                onClick: (e) => {
                    if (!isTranscriptionLoading) loadTranscription(e);
                },
            });
        }

        if (React.isValidElement(children)) {
            const prevOnClick = children.props?.onClick;
            return React.cloneElement(children, {
                onClick: (e) => {
                    prevOnClick?.(e);
                    if (!e?.defaultPrevented && !isTranscriptionLoading) {
                        loadTranscription(e);
                    }
                },
                "aria-busy": isTranscriptionLoading || undefined,
            });
        }

        return (
            <span onClick={!isTranscriptionLoading ? loadTranscription : undefined}>
                {children}
            </span>
        );
    }, [children, isTranscriptionLoading, loadTranscription]);

    // compute matches for Searcher counters + pass to tabs via ctx
    const { matchesByChunk, flatCount } = useMemo(() => {
        const map = new Map();
        let total = 0;
        const chunks = tData?.transcription?.chunks || [];
        if (query) {
            for (let i = 0; i < chunks.length; i++) {
                const m = findMatches(chunks[i].text ?? "", query);
                if (m.length) {
                    map.set(i, m);
                    total += m.length;
                }
            }
        }
        return { matchesByChunk: map, flatCount: total };
    }, [tData, query]);

    const safeActive = flatCount ? Math.max(0, Math.min(activeIdx, flatCount - 1)) : -1;

    const goNext = useCallback(() => {
        if (!flatCount) return;
        setActiveIdx((i) => (i + 1) % flatCount);
    }, [flatCount]);

    const goPrev = useCallback(() => {
        if (!flatCount) return;
        setActiveIdx((i) => (i - 1 + flatCount) % flatCount);
    }, [flatCount]);

    const clearSearch = useCallback(() => {
        setQuery("");
        setActiveIdx(0);
    }, []);

    tabsCtx.transcription.search = {
        query,
        activeIdx: safeActive,
        matchesByChunk,
    };

    return (
        <>
            {trigger}
            <Backdrop
                open={isTranscriptionLoading}
                sx={{
                    zIndex: (theme) => (theme?.zIndex?.modal ?? 1300) + 1,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    bgcolor: "rgba(0,0,0,0.35)",
                }}
            >
                <CircularProgress size={24} color="inherit" />
            </Backdrop>
            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="transcription-modal-title"
                aria-describedby="transcription-modal-description"
                className={styles.modal}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
            >
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        width: "100%",
                        padding: "0rem 0.5rem",
                        boxSizing: "border-box",
                        borderBottom: "1px solid var(--palette-border-primary)",
                        flexShrink: 0,
                    }}>
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", py: "0.75rem" }}>
                                <AmoCallDirectionIcon callType={callType} fromLead={fromLead} />
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "0rem" }}>
                                    <Typography variant="body1" sx={{ fontSize: "1rem", lineHeight: 1.2 }}>
                                        {callName}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.8125rem", color: "var(--palette-text-secondary-dark-green)" }}>
                                        {callTimingText}
                                    </Typography>
                                </Box>
                                {entityHref && entityType && entityId ? (
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", alignSelf: "flex-start", marginLeft: "2rem" }}>
                                        <a href={entityHref} style={{ textDecoration: "none" }}>
                                            <Typography sx={{ fontSize: "1rem", color: "var(--base_button_active)", textDecoration: "none", lineHeight: 1.225, fontWeight: 500 }}>
                                                {`${entityType === "lead" ? "Сделка" : "Контакт"} #${entityId}`}
                                            </Typography>
                                        </a>
                                    </Box>
                                ) : null}
                            </Box>
                        </Box>
                        <Button
                            onClick={handleClose}
                            sx={{
                                ml: "auto",
                                p: 0,
                                justifyContent: "flex-end",
                                fontSize: "1.5rem",
                                alignSelf: "flex-start",
                                "&:hover": { backgroundColor: "transparent", boxShadow: "none", opacity: "0.75" },
                            }}
                        >
                            &#10006;
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <CallPlayer ref={playerRef} link={audioLink} duration={duration} />
                        {
                            <Searcher
                                value={query}
                                onChange={handleSearchChange}
                                total={flatCount}
                                activeIndex={safeActive >= 0 ? safeActive : 0}
                                onPrev={goPrev}
                                onNext={goNext}
                                onClear={clearSearch}
                            />
                        }
                    </Box>

                    <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                        <ModalTabs ctx={tabsCtx} />
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

function AmoCallDirectionIcon({ fromLead, callType }) {
    if (fromLead) {
        const directionClass =
            callType === "incoming"
                ? "feed-note__icon-direction feed-note__icon-direction_in"
                : "feed-note__icon-direction feed-note__icon-direction_out";

        return (
            <div className="feed-note__icon">
                <div className={clsx("feed-note__icon-inner", styles.callIcon)}>
                    <svg className="svg-icon svg-notes--feed-phone-dims">
                        <use xlinkHref="#notes--feed-phone" />
                    </svg>
                    <span className={directionClass}>
                        <svg className="svg-icon svg-notes--feed-arrow-dims">
                            <use xlinkHref="#notes--feed-arrow" />
                        </svg>
                    </span>
                </div>
            </div>
        );
    }
    return (
        <span
            className={clsx(
                `icon icon-inline call_analytics_icon icon-call-type-${callType === "incoming" ? "in" : "out"}bound js-call-type`,
            )}
            style={{ margin: "0 0.6rem" }}
        />
    );
}

function formatDateTime(timestamp, timezone = "Europe/Moscow") {
    if (timestamp < 1e12) timestamp *= 1000;
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    return formatter.format(date).replace(",", "");
}