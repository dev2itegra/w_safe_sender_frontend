import { useEffect, useRef, useState, useCallback } from "react";

function expBackoff(attempt, maxBackoff) {
    const base = Math.min(1000 * (2 ** attempt), maxBackoff);
    return base + Math.floor(Math.random() * 250);
}

export function useWebSocket(
    url,
    {
        protocols,
        onOpen,
        onClose,
        onError,
        onMessage,
        heartbeatMs = 15000,
        maxBackoff = 10000,
    } = {}
) {
    const wsRef = useRef(null);
    const timerRef = useRef(null);
    const hbRef = useRef(null);
    const mountedRef = useRef(false);
    const manualCloseRef = useRef(false);
    const attemptRef = useRef(0);
    const [ready, setReady] = useState(false);

    const onOpenRef = useRef(onOpen);
    const onCloseRef = useRef(onClose);
    const onErrorRef = useRef(onError);
    const onMessageRef = useRef(onMessage);

    useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);
    useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

    const cleanup = useCallback(() => {
        if (hbRef.current) clearInterval(hbRef.current);
        if (wsRef.current) {
            try { wsRef.current.close(); } catch {}
            wsRef.current.onopen = null;
            wsRef.current.onclose = null;
            wsRef.current.onmessage = null;
            wsRef.current.onerror = null;
        }
        wsRef.current = null;
        setReady(false);
    }, []);

    const connect = useCallback(() => {
        if (!url || manualCloseRef.current) return;
        if (wsRef.current) return;
        cleanup();
        const ws = new WebSocket(url, protocols);
        wsRef.current = ws;

        ws.onopen = () => {
            if (!mountedRef.current) return;
            setReady(true);
            attemptRef.current = 0;
            onOpenRef.current && onOpenRef.current(ws);
            hbRef.current = setInterval(() => {
                try { ws.send(JSON.stringify({ type: "ping" })); } catch {}
            }, heartbeatMs);
        };

        ws.onmessage = (evt) => {
            if (!mountedRef.current) return;
            try {
                const data = JSON.parse(evt.data);
                onMessageRef.current && onMessageRef.current(data, evt);
            } catch {}
        };

        ws.onclose = (ev) => {
            if (!mountedRef.current) return;
            setReady(false);
            onCloseRef.current && onCloseRef.current(ev);
            if (hbRef.current) clearInterval(hbRef.current);
            wsRef.current = null;
            if (!manualCloseRef.current) {
                const next = expBackoff(attemptRef.current, maxBackoff);
                timerRef.current = setTimeout(() => {
                    attemptRef.current += 1;
                    connect();
                }, next);
            }
        };

        ws.onerror = (ev) => {
            onErrorRef.current && onErrorRef.current(ev);
            try { ws.close(); } catch {}
        };
    }, [url, protocols, heartbeatMs, maxBackoff, cleanup]);

    const close = useCallback(() => {
        manualCloseRef.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        mountedRef.current = true;
        manualCloseRef.current = false;
        if (url) connect();
        return () => {
            mountedRef.current = false;
            if (timerRef.current) clearTimeout(timerRef.current);
            cleanup();
        };
    }, [url, connect, cleanup]);

    const send = useCallback((obj) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(obj));
            return true;
        }
        return false;
    }, []);

    return { ready, send, close };
}
