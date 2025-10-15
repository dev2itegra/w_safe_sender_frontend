import React from "react";

// import { SettingsTab } from "./settings/tab";
// import { Analytics } from "../../analytics/analytics";
import Templates from "./templates/tab";
import ServicesSettings from "./services";


export const modules = [
    {
        name: "Сервисы",
        render: (ctx) => <ServicesSettings {...ctx.services}/> 
    },
    {
        name: "Шаблоны",
        render: (ctx) => <Templates {...ctx.templates}/> 
    },
    {
        name: "Инструкция",
        isLink: true,
        getLink: (ctx) => ctx.instruction.link,
    },
    {
        name: "Аналитика",
        render: (ctx) => <div>Аналитика</div>,
        // render: (ctx) => <Analytics {...ctx.analytics} />,
    },
];
