import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";

import { Filters } from "./filters";
import { ResultsTable } from "./results/table";
import { baseApiInstance } from "../../services/requests/axios.instance";
import { amoApiInstance } from "../../services/requests/amoAPI";
import { ResultsOverview } from "./results/overview";
import { PaginationBlock } from "./results/paging";
import { ResultsLoading } from "./results/resultsLoading";
import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification";


function repeatKeyParamsSerializer(p) {
    const usp = new URLSearchParams();
    Object.entries(p).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const isFilter = /\bfilter\[[^\]]+\]$/.test(key);
            const k = isFilter ? key.replace(/\]$/, "][]") : key;
            value.forEach((v) => usp.append(k, String(v)));
        } else if (value !== undefined && value !== null && value !== "") {
            usp.append(key, String(value));
        }
    });
    return usp.toString();
}

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}


export function Analytics({ widget, managersList }) {
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [contactId, setContactId] = useState(0);
    const [callType, setCallType] = useState("any");
    const [isProcessing, setIsProcessing] = useState(false);
    const [managerId, setManagerId] = useState(0);
    const [calls, setCalls] = useState([]);
    const [overview, setOverview] = useState(null);
    const [entitiesNames, setEntitiesNames] = useState({ leads: {}, contacts: {} });

    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);



    const { leadIds, contactIds } = useMemo(() => {
        const leadSet = new Set();
        const contactSet = new Set();

        for (const call of calls) {
            const idNum = Number(call?.linked_entity_id);
            if (!idNum) continue;
            if (call?.linked_entity_type === "lead") {
                leadSet.add(idNum);
            } else if (call?.linked_entity_type === "contact") {
                contactSet.add(idNum);
            }
        }

        return {
            leadIds: Array.from(leadSet),
            contactIds: Array.from(contactSet),
        };
    }, [calls]);

    const missingLeadIds = useMemo(
        () => leadIds.filter((id) => !entitiesNames.leads[id]),
        [leadIds, entitiesNames.leads]
    );
    const missingContactIds = useMemo(
        () => contactIds.filter((id) => !entitiesNames.contacts[id]),
        [contactIds, entitiesNames.contacts]
    );
    
    const getManagerName = useCallback(
        (id) => {
            return managersList.find((m) => (m.id === id))?.name || "Менеджер не найден";
        },
        [managersList]
    );

    useEffect(() => {
        let aborted = false;
        const BATCH = 200;

        const upsertLeads = (mapObj) => {
            if (!mapObj || Object.keys(mapObj).length === 0) return;
            setEntitiesNames((prev) => ({
                leads: { ...prev.leads, ...mapObj },
                contacts: { ...prev.contacts },
            }));
        };

        const upsertContacts = (mapObj) => {
            if (!mapObj || Object.keys(mapObj).length === 0) return;
            setEntitiesNames((prev) => ({
                leads: { ...prev.leads },
                contacts: { ...prev.contacts, ...mapObj },
            }));
        };

        const parseLeads = (data) => {
            const out = {};
            const items = data?._embedded?.leads ?? [];
            if (Array.isArray(items)) {
                for (const lead of items) {
                    if (lead?.id != null) {
                        const k = String(lead.id);
                        out[k] = typeof lead.name === "string" && lead.name
                            ? lead.name
                            : `Сделка #${lead.id}`;
                    }
                }
            }
            return out;
        };

        const parseContacts = (data) => {
            const out = {};
            const items = data?._embedded?.contacts ?? [];
            if (Array.isArray(items)) {
                for (const contact of items) {
                    if (contact?.id != null) {
                        const k = String(contact.id);
                        out[k] = typeof contact.name === "string" && contact.name
                            ? contact.name
                            : `Контакт #${contact.id}`;
                    }
                }
            }
            return out;
        };

        async function fetchLeads(ids) {
            for (const part of chunk(ids, BATCH)) {
                if (aborted) return;
                const res = await amoApiInstance.get("/api/v4/leads", {
                    params: { "filter[id]": part, limit: Math.min(part.length, 250) },
                    paramsSerializer: repeatKeyParamsSerializer,
                });
                if (aborted) return;
                const mapObj = parseLeads(res?.data);
                upsertLeads(mapObj);
            }
        }

        async function fetchContacts(ids) {
            for (const part of chunk(ids, BATCH)) {
                if (aborted) return;
                const res = await amoApiInstance.get("/api/v4/contacts", {
                    params: { "filter[id]": part, limit: Math.min(part.length, 250) },
                    paramsSerializer: repeatKeyParamsSerializer,
                });
                if (aborted) return;
                const mapObj = parseContacts(res?.data);
                upsertContacts(mapObj);
            }
        }

        async function run() {
            try {
                await Promise.all([
                    missingLeadIds.length ? fetchLeads(missingLeadIds) : Promise.resolve(),
                    missingContactIds.length ? fetchContacts(missingContactIds) : Promise.resolve(),
                ]);
            } catch (e) {
                if (!aborted) console.error("Fetch entity names error", e);
            }
        }

        if (missingLeadIds.length === 0 && missingContactIds.length === 0) return;

        run();
        return () => { aborted = true; };
    }, [missingLeadIds, missingContactIds]);


    const callsWithEntityNames = useMemo(() => {
        return calls.map((call) => {
            const idKey = String(call?.linked_entity_id);
            const entityName =
                call?.linked_entity_type === "lead"
                    ? (entitiesNames.leads[idKey] ?? "Название не найдено")
                    : call?.linked_entity_type === "contact"
                        ? (entitiesNames.contacts[idKey] ?? "Название не найдено")
                        : "Название не найдено";

            const entityLink = `/${call?.linked_entity_type}s/detail/${call?.linked_entity_id}`;

            return {
                ...call,
                created_by : call.created_by === 0? "Автотранскрибация" :  getManagerName(call.created_by),
                responsible_manager : getManagerName(call.responsible_manager_id),
                entity_name: entityName,
                entity_link: entityLink,
            };
        });
    }, [calls, entitiesNames]);

    const onSearch = useCallback(async () => {
        try {
            setIsProcessing(true);

            const params = {
                call_type: callType,
                page: currentPage,
            };

            if (contactId && contactId !== 0) {
                params.crm_contact_id = contactId;
            }

            if (managerId && Number.isFinite(managerId)) {
                params.responsible_managers_ids = [managerId];
            }

            if (dateFrom && dayjs.isDayjs(dateFrom)) {
                params.call_created_from = dateFrom.toDate().toISOString();
            }
            if (dateTo && dayjs.isDayjs(dateTo)) {
                params.call_created_to = dateTo.toDate().toISOString();
            }

            const response = await baseApiInstance.get(
                "/analytics/transcriptions",
                {
                    params,
                    paramsSerializer: (p) => {
                        const usp = new URLSearchParams();
                        Object.entries(p).forEach(([key, value]) => {
                            if (Array.isArray(value)) {
                                value.forEach((v) => usp.append(key, String(v)));
                            } else if (value !== undefined && value !== null && value !== "") {
                                usp.append(key, String(value));
                            }
                        });
                        return usp.toString();
                    },
                }
            );
            const calls = response.data.transcriptions?.transcriptions;
            
            setMaxPage(response.data.max_page);
            setCalls(calls);

            setOverview(
                {
                    total_calls_amount : response.data.transcriptions?.total_calls_amount,
                    incoming_calls_amount : response.data.transcriptions?.incoming_calls_amount,
                    outgoing_calls_amount : response.data.transcriptions?.outgoing_calls_amount,
                    total_duration : response.data.transcriptions?.total_duration,
                }
            );
        
        } catch (e) {
            console.error("Search analytics error", e);
            sendAmoErrorNotification("Ошибка загрузки аналитики");
        } finally {
            setIsProcessing(false);
        }
    }, [currentPage, callType, managerId, dateFrom, dateTo, contactId]);


    useEffect(() => { onSearch(); }, [currentPage])


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Filters 
                dateFrom={dateFrom} 
                dateTo={dateTo} 
                setDateFrom={setDateFrom} 
                setDateTo={setDateTo}
                callType={callType}
                setCallType={setCallType}
                onSearch={onSearch}
                managerId={managerId}
                setManagerId={setManagerId}
                managersList={managersList}
                isProcessing={isProcessing}
                contactId={contactId}
                setContactId={setContactId}
            />

            {
                isProcessing?
                    <ResultsLoading rowsNumber={calls.length || 10}/>
                :
                    <>
                        <ResultsOverview overview={overview} />
                        <ResultsTable calls={callsWithEntityNames} />
                        {
                            maxPage > 1 ?
                                <PaginationBlock 
                                    currentPage={currentPage} 
                                    setCurrentPage={setCurrentPage} 
                                    maxPage={maxPage} 
                                    isLoading={isProcessing}
                                />
                            : <></>
                        }
                    </>
            }
        </Box>
    )
}