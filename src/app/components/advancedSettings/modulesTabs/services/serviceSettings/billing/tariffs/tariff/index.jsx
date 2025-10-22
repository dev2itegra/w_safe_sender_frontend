import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";


import { sendAmoErrorNotification } from "../../../../../../../../services/amoNotification/sendNotification";
import Price from "./price";
import Duration from "./duration";
import Bonus from "./bonus";
import PayOnlineButton from "./payOnlineButton";
import RequestInvoiceButton from "./requestInvoiceButton";


export default function PaymentTariff({
    serviceId,
    tariffId,
    price,
    duration,
    bonus = null,
    robokassa,
    accountId,
    loadingTariff,
    setLoadingTariff,
}) {
    const isLoading = loadingTariff === tariffId;

    const notify = useCallback(( text ) => {
        try {
            sendAmoErrorNotification(text)
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handlePayOnline = useCallback(async () => {
        setLoadingTariff(tariffId);

        try {
            if (!robokassa || typeof robokassa.startPayment !== "function") {
                notify("Модуль оплаты не загружен");
                return;
            }

            const url = `/subscription/iframe?tariff=${tariffId}&store_id=${serviceId}`;
            const response = await fetchWithAuth(url, "GET");

            if (response?.statusCode === 200) {
                const iframeBody = response?.content?.content?.iframe_body;
                if (iframeBody) {
                    robokassa.startPayment(iframeBody);
                } else {
                    notify("Не удалось получить тело iframe");
                }
            } else {
                notify(`Не удалось инициализировать оплату: ${response?.statusCode ?? "unknown"}`);
            }
        } catch {
            notify("Не удалось инициализировать оплату");
        } finally {
            setLoadingTariff(null);
        }
    }, [notify, robokassa, setLoadingTariff, serviceId, tariffId]);

    const handleInvoice = useCallback(() => {
        const id = accountId ?? "";
        window.open(`https://integrator2.ru/companyform/?utm_id=${id}`, "_blank");
    }, [accountId]);

    return (
        <Box 
            sx={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "2px solid #7fa6e8",
                alignItems: "center",
                p: "20px 15px 20px",
            }}
        >
            <Price value={price} />
            <Duration value={duration} />
            {
                bonus && 
                <Bonus value={bonus} />
            }

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                    width: "100%",
                    mt: "auto",
                }}
            >
                <PayOnlineButton 
                    onClick={handlePayOnline}
                    isLoading={isLoading}
                />
                <RequestInvoiceButton 
                    onClick={handleInvoice}
                />
            </Box>
        </Box>
    );
}