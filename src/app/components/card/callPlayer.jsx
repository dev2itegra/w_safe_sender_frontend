import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useCallback,
} from "react";
import { Box, Alert, CircularProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { calculateDuration, formatDuration } from "./durationCalculating.js";
import styles from "./transcription.module.scss";

const playerButtonStyles = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fill: "var(--button_blue)",
    transition: "opacity 0.1s ease-in-out",
    "&:hover": { opacity: 0.85 },
};

function probeAudio(url, timeoutMs = 6000) {
    return new Promise((resolve) => {
        if (!url) return resolve(false);
        const audio = new Audio();
        let done = false;
        let timer = null;

        const cleanup = () => {
            audio.removeEventListener("loadedmetadata", onOk);
            audio.removeEventListener("canplay", onOk);
            audio.removeEventListener("error", onErr);
            if (timer) clearTimeout(timer);
            audio.src = "";
        };

        const finish = (ok) => {
            if (done) return;
            done = true;
            cleanup();
            resolve(ok);
        };

        const onOk = () => finish(true);
        const onErr = () => finish(false);

        audio.preload = "metadata";
        audio.addEventListener("loadedmetadata", onOk, { once: true });
        audio.addEventListener("canplay", onOk, { once: true });
        audio.addEventListener("error", onErr, { once: true });
        audio.src = url;
        audio.load();

        timer = setTimeout(() => finish(false), timeoutMs);
    });
}

export const CallPlayer = forwardRef(function CallPlayer(
    { link, duration: durationProp },
    ref
) {
    const audioRef = useRef(null);

    const [availability, setAvailability] = useState("checking"); // checking | available | unavailable
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressPct, setProgressPct] = useState(0);
    const [currentSecond, setCurrentSecond] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [metaDuration, setMetaDuration] = useState(0);

    const effectiveDuration = durationProp || metaDuration || 0;

    useEffect(() => {
        let alive = true;
        setAvailability("checking");
        probeAudio(link, 6000).then((ok) => {
            if (!alive) return;
            setAvailability(ok ? "available" : "unavailable");
        });
        return () => {
            alive = false;
        };
    }, [link]);

    const play = useCallback(() => {
        if (availability !== "available") return;
        const a = audioRef.current;
        if (!a) return;
        const p = a.play();
        if (p && typeof p.then === "function") {
            p.catch(() => {});
        }
        setIsPlaying(true);
    }, [availability]);

    const pause = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.pause();
        setIsPlaying(false);
    }, []);

    const stop = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.pause();
        a.currentTime = 0;
        setIsPlaying(false);
        setCurrentSecond(0);
        setProgressPct(0);
    }, []);

    const seek = useCallback(
        (second) => {
            const a = audioRef.current;
            if (!a) return;
            const dur = effectiveDuration || a.duration || 0;
            const clamped = Math.max(0, Math.min(second, dur || 0));
            a.currentTime = clamped;
            play();
        },
        [effectiveDuration, play]
    );

    useImperativeHandle(ref, () => ({ seek }), [seek]);

    const togglePlayback = () => {
        if (isPlaying) pause();
        else play();
    };

    const changePlaybackRate = (newRate) => {
        const a = audioRef.current;
        if (!a) return;
        a.playbackRate = newRate;
        setPlaybackRate(newRate);
    };

    useEffect(() => {
        if (availability !== "available") return;
        const a = audioRef.current;
        if (!a) return;

        const onLoadedMeta = () => {
            setMetaDuration(a.duration || 0);
        };
        const onTimeUpdate = () => {
            const cur = a.currentTime || 0;
            setCurrentSecond(cur);
            const dur = effectiveDuration || a.duration || 0;
            setProgressPct(dur ? (cur / dur) * 100 : 0);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentSecond(0);
            setProgressPct(0);
        };

        a.addEventListener("loadedmetadata", onLoadedMeta);
        a.addEventListener("timeupdate", onTimeUpdate);
        a.addEventListener("ended", onEnded);

        setIsPlaying(false);
        setCurrentSecond(0);
        setProgressPct(0);
        setMetaDuration(0);
        a.currentTime = 0;

        return () => {
            a.removeEventListener("loadedmetadata", onLoadedMeta);
            a.removeEventListener("timeupdate", onTimeUpdate);
            a.removeEventListener("ended", onEnded);
        };
    }, [link, effectiveDuration, availability]);

    const playFromSecond = useCallback(
        (second) => {
            seek(second);
        },
        [seek]
    );

    const pct = effectiveDuration ? (currentSecond / effectiveDuration) * 100 : 0;

    const handleSeekByPct = useCallback(
        (pct) => {
            const a = audioRef.current;
            if (!a) return;
            const dur = a.duration || effectiveDuration || 0;
            if (!dur) return;
            seek(pct * dur);
        },
        [effectiveDuration, seek]
    );

    if (availability === "checking") {
        return (
            <div style={{ padding: "0.5rem", boxSizing: "border-box", flex: 1 }}>
                <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
                    <span 
                        style={{
                            letterSpacing: "0.07rem",
                            fontSize: "0.9rem",
                            padding: "0.2rem 0",
                            fontWeight: 550,
                        }}
                    >
                            Загрузка аудиозаписи
                    </span>
                    <CircularProgress size={18} />
                </Box>
            </div>
        );
    }

    if (availability === "unavailable") {
        return (
            <div style={{ padding: "0.5rem", boxSizing: "border-box", flex: 1 }}>
                <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "flex-start", gap: 1 }}>
                    <span 
                        style={{
                            letterSpacing: "0.07rem",
                            fontSize: "0.9rem",
                            padding: "0.2rem 0",
                            color: "var(--color-begonia)",
                            fontWeight: 550,
                        }}
                    >
                            Аудиозапись недоступна в телефонии
                    </span>
                </Box>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "0.5rem",  
                boxSizing: "border-box",
                flex: 1,
            }}
        >
            <Box
                sx={{
                    flex: "1 0 0",
                    height: "2.5rem",
                    p: "0.5rem",
                    boxSizing: "border-box",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                    border: "1px solid var(--palette-border-default)",
                    borderRadius: "0.25rem",
                }}
            >
                <span onClick={togglePlayback}>
                    {isPlaying ? (
                        <PauseIcon sx={playerButtonStyles} />
                    ) : (
                        <PlayArrowIcon sx={playerButtonStyles} />
                    )}
                </span>
                <span>
                    <StopCircleIcon sx={playerButtonStyles} onClick={stop} />
                </span>

                <AudioProgressBar currentPct={pct} onSeekPct={handleSeekByPct} />

                <Timing max={effectiveDuration} current={currentSecond} />

                <select
                    value={playbackRate}
                    onChange={(e) => changePlaybackRate(Number(e.target.value))}
                    className={styles.playerSpeedSelect}
                >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                </select>
            </Box>

            {availability === "available" ? (
                <audio ref={audioRef} src={link} style={{ display: "none" }} />
            ) : null}
        </div>
    );
});

function AudioProgressBar({ currentPct, onSeekPct }) {
    const trackRef = useRef(null);

    const handleClick = (e) => {
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(x / rect.width, 1));
        onSeekPct?.(pct);
    };

    return (
        <Box sx={{ flex: 1, minWidth: 0, px: 0 }}>
            <Box
                ref={trackRef}
                onClick={handleClick}
                sx={{
                    position: "relative",
                    height: 6,
                    borderRadius: 3,
                    background: "var(--palette-border-default)",
                    overflow: "hidden",
                    boxSizing: "content-box",
                    cursor: "pointer",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "left center",
                        transform: `scaleX(${(currentPct || 0) / 100})`,
                        backgroundColor: "var(--button_blue)",
                        pointerEvents: "none",
                    }}
                />
            </Box>
        </Box>
    );
}

function Timing({ max, current }) {
    return (
        <Box
            sx={{
                color: "var(--palette-text-secondary-dark-green)",
                fontSize: "0.8125rem",
                display: "flex",
            }}
        >
            <span>{formatDuration(calculateDuration(current || 0))}</span>
            <span style={{ margin: "0 0.1rem" }}>/</span>
            <span>{formatDuration(calculateDuration(max || 0))}</span>
        </Box>
    );
}
