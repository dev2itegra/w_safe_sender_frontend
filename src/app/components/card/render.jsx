import React from "react";
import { createRoot } from "react-dom/client";
import { TranscriptionLoaderButton } from "./loaderButton";
import styles from "./transcription.module.scss";

const roots = new WeakMap();
const pendingRemovals = new Set();
let cleanupTimer = null;

function scheduleCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setTimeout(() => {
        for (const node of Array.from(pendingRemovals)) {
            pendingRemovals.delete(node);
            if (!(node instanceof Element)) continue;
            if (document.contains(node)) continue;
            if (node.dataset?.s2tModalOpen === "1") continue;
            const rec = roots.get(node);
            if (rec) {
                try { rec.root.unmount(); } catch {}
                roots.delete(node);
            }
        }
        cleanupTimer = null;
    }, 60);
}

function getNoteContent(callNote) {
    const jsNote = Array.from(callNote.children).find(
        (el) => el instanceof Element && el.classList.contains("js-note")
    );
    if (!jsNote) return null;
    return jsNote.querySelector(".feed-note__call-content");
}

function renderIntoContainer(callNote, container, widget) {
    const entityLinkElement = callNote.querySelector(".feed-note__linked-inner");
    const entityHref = entityLinkElement ? entityLinkElement.href : null;
    

    let entityType, entityId;
    if (!entityHref) {
        if (window.location.pathname.includes("leads")) {
            entityType = "lead";
            entityId = window.location.pathname.split("detail/")[1];
        } else if (window.location.pathname.includes("contacts")) {
            entityType = "contact";
            entityId = window.location.pathname.split("detail/")[1];
        } else {
            entityType = null;
            entityId = null;
        }
    } else {
        if (entityHref.includes("leads")) {
            entityType = "lead";
            entityId = entityHref.split("detail/")[1];
        } else if (entityHref.includes("contacts")) {
            entityType = "contact";
            entityId = entityHref.split("detail/")[1];
        } else {
            entityType = null;
            entityId = null;
        }
    }

    let record = roots.get(callNote);
    if (record && record.container !== container) {
        try { record.root.unmount(); } catch {}
        roots.delete(callNote);
        record = undefined;
    }

    const root = record?.root ?? createRoot(container);

    if (!container.firstElementChild) {
        root.render(
            <TranscriptionLoaderButton
                widget={widget}
                callEventId={callNote.getAttribute("data-id")}
                callEntityId={entityId}
                callEntityType={entityType}                
            >
                <span
                    className={`${styles.loaderButton} feed-note__call-play`}
                    style={{
                        pointerEvents: "auto",
                        opacity: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                    title="Получить транскрибацию звонка через виджет Speech2Text"
                >
                    <span className="feed-note__call-player-text">Speech2Text</span>
                </span>
            </TranscriptionLoaderButton>
        );
    }

    if (!record) {
        roots.set(callNote, { root, container });
    }
}

function mountIntoCallNote(callNote, widget) {
    if (!callNote) return;

    const noteContent = getNoteContent(callNote);
    if (!noteContent) return;

    let container = noteContent.querySelector(".s2t-transcription-button-container");
    if (!container) {
        container = document.createElement("a");
        container.className = "s2t-transcription-button-container";
        container.setAttribute("role", "button");
        container.setAttribute("tabindex", "0");
        noteContent.appendChild(container);
    }

    renderIntoContainer(callNote, container, widget);
}

function processNodes(nodes, widget) {
    for (const node of nodes) {
        if (!(node instanceof Element)) continue;

        if (node.matches(".feed-note-wrapper-call_in_out")) {
            mountIntoCallNote(node, widget);
        }

        node.querySelectorAll?.(".feed-note-wrapper-call_in_out")?.forEach((el) =>
            mountIntoCallNote(el, widget)
        );

        const parentNote = node.closest?.(".feed-note-wrapper-call_in_out");
        if (parentNote) mountIntoCallNote(parentNote, widget);
    }
}

function reconcileAll(widget) {
    document
        .querySelectorAll(".feed-note-wrapper-call_in_out")
        .forEach((n) => mountIntoCallNote(n, widget));
}

export function initCallTranscriptionButtons(widget) {
    document
        .querySelectorAll(".feed-note-wrapper-call_in_out")
        .forEach((callNote) => mountIntoCallNote(callNote, widget));

    const observer = new MutationObserver((mutations) => {
        let hasAdded = false;
        for (const m of mutations) {
            if (m.type !== "childList") continue;

            if (m.addedNodes?.length) {
                hasAdded = true;
                processNodes(m.addedNodes, widget);
            }

            if (m.removedNodes?.length) {
                for (const node of m.removedNodes) {
                    if (!(node instanceof Element)) continue;

                    if (node.matches?.(".feed-note-wrapper-call_in_out")) {
                        pendingRemovals.add(node);
                    }
                    node.querySelectorAll?.(".feed-note-wrapper-call_in_out")?.forEach((n) =>
                        pendingRemovals.add(n)
                    );
                }
            }
        }
        scheduleCleanup();
        if (hasAdded) reconcileAll(widget);
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    const cleanup = () => {
        observer.disconnect();
        if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer = null; pendingRemovals.clear(); }
        for (const [wrapper, rec] of Array.from(roots.entries())) {
            try { rec.root.unmount(); } catch {}
            roots.delete(wrapper);
        }
        document
            .querySelectorAll(".s2t-transcription-button-container")
            .forEach((el) => el.remove());
    };

    return cleanup;
}

export function renderCallTranscriptionButtons(widget) {
    reconcileAll(widget);
}
