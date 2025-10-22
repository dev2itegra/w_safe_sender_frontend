import React, { useEffect, useMemo, useState, useCallback } from "react";

import { Box } from "@mui/material";
import TarifficationInfo from "./explanation";
import PaymentTariff from "./tariff";

import Robokassa from "./robokassa_iframe";


export default function TariffsBlock({ serviceId }) {

    const [loadingTariff, setLoadingTariff] = useState(null);

    const robokassa = useMemo(() => Robokassa, []);

    const accountId = useMemo(() => {
        try {
            return window.APP.constant("account").id;
        } catch {
            return null;
        }
    }, []);

    const variants = useMemo(
        () => [
            { tariffId: 1, price: "1 800 руб.", duration: "1 месяц", bonus: null },
            { tariffId: 2, price: "10 000 руб.", duration: "6 месяцев",  bonus: "+1 месяц в подарок" },
            { tariffId: 3, price: "15 000 руб.", duration: "10 месяцев", bonus: "+3 месяца в подарок" },
        ],
        []
    );

    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "1.3rem",
            }}
        >
            <TarifficationInfo />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "20px",
                    pb: "3.5rem",
                }}
            >
                {variants.map((v) => (
                    <PaymentTariff
                        key={v.tariffId}
                        serviceId={serviceId}
                        tariffId={v.tariffId}
                        price={v.price}
                        duration={v.duration}
                        bonus={v.bonus}
                        robokassa={robokassa}
                        accountId={accountId}
                        loadingTariff={loadingTariff}
                        setLoadingTariff={setLoadingTariff}
                    />
                ))}
            </Box>
        </Box>
    );
}


