import React, { useMemo, useEffect, useReducer, useCallback } from "react";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Duration } from "./duration";
import { Managers } from "./managers";
import { Statuses } from "./statuses";

const ACTIONS = {
    RESET: "RESET",
    SET_ENABLED: "SET_ENABLED",
    SET_DURATION: "SET_DURATION",
    SET_ALL_MANAGERS: "SET_ALL_MANAGERS",
    SET_ALL_STATUSES: "SET_ALL_STATUSES",
    SET_MANAGERS: "SET_MANAGERS",
    SET_STATUSES: "SET_STATUSES",
    TOGGLE_MANAGER: "TOGGLE_MANAGER",
    TOGGLE_STATUS: "TOGGLE_STATUS",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.RESET: {
            return { ...action.payload };
        }
        case ACTIONS.SET_ENABLED: {
            return { ...state, is_enabled: action.payload };
        }
        case ACTIONS.SET_DURATION: {
            return { ...state, duration: { ...action.payload } };
        }
        case ACTIONS.SET_ALL_MANAGERS: {
            return {
                ...state,
                all_managers: action.payload,
                managers: action.payload ? [] : state.managers,
            };
        }
        case ACTIONS.SET_ALL_STATUSES: {
            return {
                ...state,
                all_statuses: action.payload,
                statuses: action.payload ? [] : state.statuses,
            };
        }
        case ACTIONS.SET_MANAGERS: {
            return { ...state, managers: [...action.payload], all_managers: false };
        }
        case ACTIONS.SET_STATUSES: {
            return { ...state, statuses: [...action.payload], all_statuses: false };
        }
        case ACTIONS.TOGGLE_MANAGER: {
            const id = action.payload;
            const set = new Set(state.managers);
            if (set.has(id)) set.delete(id); else set.add(id);
            return { ...state, managers: Array.from(set), all_managers: false };
        }
        case ACTIONS.TOGGLE_STATUS: {
            const id = action.payload;
            const set = new Set(state.statuses);
            if (set.has(id)) set.delete(id); else set.add(id);
            return { ...state, statuses: Array.from(set), all_statuses: false };
        }
        default:
            return state;
    }
}

function shallowEqualCallSlice(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.is_enabled !== b.is_enabled) return false;
    if (a.all_managers !== b.all_managers) return false;
    if (a.all_statuses !== b.all_statuses) return false;
    if (!a.duration || !b.duration) return false;
    if (a.duration.from !== b.duration.from) return false;
    if (a.duration.to !== b.duration.to) return false;
    const eqSet = (x = [], y = []) => {
        if (x.length !== y.length) return false;
        const sx = [...x].map(String).sort();
        const sy = [...y].map(String).sort();
        for (let i = 0; i < sx.length; i++) if (sx[i] !== sy[i]) return false;
        return true;
    };
    if (!eqSet(a.managers, b.managers)) return false;
    if (!eqSet(a.statuses, b.statuses)) return false;
    return true;
}

const keyOf = (pipelineId, statusId) => `${pipelineId}:${statusId}`;
const parseKey = (key) => {
    const [p, s] = String(key).split(":");
    return { pipelineId: Number(p), statusId: Number(s) };
};
const toKeyArray = (arr = []) =>
    arr.map(({ pipeline_id, status_id }) => keyOf(pipeline_id, status_id));

export function AutoTranscriptionCall({
    callType,
    managersList,
    pipelinesStatuses,
    transcriptionSettings,
    onChange,
}) {
    const rawSlice = useMemo(
        () => (callType === "incoming" ? transcriptionSettings.incoming : transcriptionSettings.outgoing),
        [callType, transcriptionSettings]
    );

    const selectedSliceUI = useMemo(
        () => ({ ...rawSlice, statuses: toKeyArray(rawSlice.statuses || []) }),
        [rawSlice]
    );

    const allStatusKeysCount = useMemo(() => {
        let n = 0;
        for (const p of pipelinesStatuses ?? []) n += (p.statuses?.length ?? 0);
        return n;
    }, [pipelinesStatuses]);

    const [state, dispatch] = useReducer(reducer, selectedSliceUI);

    useEffect(() => {
        if (!shallowEqualCallSlice(state, selectedSliceUI)) {
            dispatch({ type: ACTIONS.RESET, payload: selectedSliceUI });
        }
    }, [selectedSliceUI]);

    useEffect(() => {
        if (!onChange) return;
        if (!shallowEqualCallSlice(state, selectedSliceUI)) {
            const isAll = state.all_statuses || (state.statuses?.length ?? 0) === allStatusKeysCount;
            const nextStatuses = isAll
                ? []
                : (state.statuses ?? []).map((k) => {
                      const { pipelineId, statusId } = parseKey(k);
                      return { pipeline_id: pipelineId, status_id: statusId };
                  });
            const payload = { ...state, statuses: nextStatuses };
            onChange(callType, payload);
        }
    }, [callType, state, selectedSliceUI, onChange, allStatusKeysCount]);

    const setEnabled = useCallback((val) => {
        dispatch({ type: ACTIONS.SET_ENABLED, payload: val });
    }, []);

    const setDuration = useCallback((duration) => {
        dispatch({ type: ACTIONS.SET_DURATION, payload: duration });
    }, []);

    const setManagers = useCallback((ids) => {
        dispatch({ type: ACTIONS.SET_MANAGERS, payload: ids });
    }, []);

    const setStatuses = useCallback((ids) => {
        dispatch({ type: ACTIONS.SET_STATUSES, payload: ids });
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!state.is_enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        name={`autoTranscription-${callType}`}
                        sx={{
                            color: "var(--palette-border-default)",
                            "& .MuiSvgIcon-root": { borderRadius: "0.25rem" },
                            "&:hover": { backgroundColor: "transparent" },
                            "&.Mui-checked": { color: "var(--palette-border-primary)" },
                            "&.Mui-checked .MuiSvgIcon-root": {
                                backgroundColor: "transparent",
                                borderRadius: "0.25rem",
                                color: "var(--button_blue)",
                            },
                        }}
                    />
                }
                label={`Автоматически транскрибировать ${callType === "incoming" ? "входящие" : "исходящие"} звонки`}
            />

            {state.is_enabled ? (
                <AutoTranscriptionSettings
                    managersList={managersList}
                    pipelinesStatuses={pipelinesStatuses}
                    duration={state.duration}
                    setDuration={setDuration}
                    managers={state.managers}
                    setManagers={setManagers}
                    statuses={state.statuses}
                    setStatuses={setStatuses}
                    all_managers={state.all_managers}
                    all_statuses={state.all_statuses}
                    dispatch={dispatch}
                />
            ) : null}
        </Box>
    );
}

function AutoTranscriptionSettings(props) {
    const {
        managersList,
        pipelinesStatuses,
        duration,
        setDuration,
        managers,
        setManagers,
        statuses,
        setStatuses,
        all_managers,
        all_statuses,
        dispatch,
    } = props;

    return (
        <Box
            sx={{
                marginLeft: "2rem",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Duration value={duration} onChange={setDuration} />
            <Managers
                managersList={managersList}
                value={managers}
                onChange={(ids) => dispatch({ type: ACTIONS.SET_MANAGERS, payload: ids })}
                allSelected={all_managers}
                onToggleAll={(checked) => dispatch({ type: ACTIONS.SET_ALL_MANAGERS, payload: checked })}
            />
            <Statuses
                pipelines={pipelinesStatuses}
                value={statuses}
                onChange={(ids) => dispatch({ type: ACTIONS.SET_STATUSES, payload: ids })}
                allSelected={all_statuses}
                onToggleAll={(checked) => dispatch({ type: ACTIONS.SET_ALL_STATUSES, payload: checked })}
            />
        </Box>
    );
}
