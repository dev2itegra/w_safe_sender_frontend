import React from "react";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";

import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';

import styles from "./table.module.scss";
import { formatDuration } from "./duration";
import { TranscriptionLoaderButton } from "../../card/loaderButton";
import { formatDateTimeDisplay } from "../../../services/datetime/datetime";


export function ResultsTable({ calls }) {    
    return <>
        {
            calls.length > 0?
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--palette-background-primary)",
                }}
            >
                <table style={{
                    width: "100%",
                }}>
                    <thead>
                        <tr className={clsx(styles.row)}>
                            <th>Дата звонка</th>
                            <th>Инициатор транскрибации</th>
                            <th>Звонок</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calls.map((c) => {
                            return (
                                <tr 
                                    key={c.id}
                                    className={clsx(styles.row)}
                                >
                                    <td>
                                        <Typography sx={{ fontFamily: '"PT Sans", Arial, sans-serif' }}>{formatDateTimeDisplay(c.created_at)}</Typography>
                                    </td>
                                    <td>
                                        <Typography sx={{ fontFamily: '"PT Sans", Arial, sans-serif' }}>{c.created_by}</Typography>
                                    </td>
                                    <td>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.25rem",
                                                width: "100%",
                                            }}
                                        >
                                            <span 
                                                className={
                                                    clsx(
                                                        `icon icon-inline call_analytics_icon icon-call-type-${c.call_type === "incoming"? "in" : "out"}bound js-call-type`,
                                                        styles.callIcon
                                                    )
                                                }
                                            ></span>
                                            {
                                                c.call_type === "incoming" ?
                                                    (
                                                        <>
                                                            <a href={c.entity_link} className={clsx(styles.entityLink)}>{c.entity_name}</a>
                                                            <span>к {c.responsible_manager}</span>
                                                        </>
                                                    )
                                                :
                                                    (
                                                        <>
                                                            <span>{c.responsible_manager} к</span>
                                                            <a href={c.entity_link} className={clsx(styles.entityLink)}>{c.entity_name}</a>
                                                        </>   
                                                    )
                                                
                                            }
                                            
                                            <Box 
                                                sx={{
                                                    marginLeft: "auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <TranscriptionLoaderButton
                                                    widget={undefined}
                                                    callEventId={c.crm_event_id? c.crm_event_id : c.crm_note_id}
                                                    contactHref={undefined}
                                                    fromLead={false}
                                                    hidePhoneNumber={true}
                                                    callEntityType = {c.linked_entity_type}
                                                    callEntityId = {c.linked_entity_id}

                                                >
                                                    <PlayCircleFilledRoundedIcon 
                                                        sx={{
                                                            fill: "var(--button_blue)",
                                                            cursor: "pointer",
                                                            fontSize: "1.5rem",
                                                            transition: "opacity 0.1s ease-in-out",
                                                            "&:hover": { 
                                                                opacity: 0.85,
                                                            },
                                                        }}
                                                        titleAccess="Показать транскрибацию"

                                                    />
                                                </TranscriptionLoaderButton>
                                                <DownloadForOfflineRoundedIcon
                                                    sx={{
                                                        fill: "var(--button_blue)",
                                                        cursor: "pointer",
                                                        fontSize: "1.5rem",
                                                        transition: "opacity 0.1s ease-in-out",
                                                        "&:hover": { 
                                                            opacity: 0.85,
                                                        },
                                                    }}
                                                    titleAccess="Скачать аудио"
                                                    onClick={() => {window.open(c.file_link, "_blank", "download")}}
                                                />   
                                                <Typography
                                                    sx={{
                                                        color: "var(--palette-text-secondary-dark-green)",
                                                        fontFamily: '"PT Sans", Arial, sans-serif', 
                                                    }}
                                                >
                                                    {formatDuration(c.duration)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </td>
                                </tr>
                            );
                        })} 
                    </tbody>
                </table>
            </Box>
            : <></>
        }
        
    </>
}

