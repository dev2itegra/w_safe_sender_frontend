import React from "react";

import ServicesSettings from "./services";
import Analytics from "./analytics";


export const modules = [
    {
        name: "Сервисы",
        render: (ctx) => <ServicesSettings {...ctx.services}/> 
    },
    {
        name: "Инструкция",
        isLink: true,
        getLink: (ctx) => ctx.instruction.link,
    },
    {
        name: "Аналитика",
        render: (ctx) => <Analytics {...ctx.analytics} />,
    },
];
