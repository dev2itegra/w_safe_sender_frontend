import React from "react";

// import { Analytics } from "../../analytics/analytics";
import ServicesSettings from "./services";


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
    // {
    //     name: "Аналитика",
    //     render: (ctx) => <div>Аналитика</div>,
    //     // render: (ctx) => <Analytics {...ctx.analytics} />,
    // },
];
