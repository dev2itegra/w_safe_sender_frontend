import React from "react";
import { createRoot } from "react-dom/client";

import SettingsBlock from "./components/settings/settingsBlock";
import AdvancedSettings from "./components/advancedSettings/advancedSettings";

import { baseApiInstance } from "./services/requests/axios.instance";
import DigitalPipelineSettings from "./components/DP";


const Widget = (widget, Modal) => {
    widget.callbacks = {
        settings: async () => {
            const c = document.querySelector(".widget-settings__wrap-desc-space");
            if (c) c.style.paddingBottom = "0";
            
            const targetElement = document.querySelector(
                ".widget_settings_block__fields"
            );
            createRoot(targetElement).render(
                <SettingsBlock widget = {widget} />
            );
            return true;
        },

        onSave: async (data) => {
            const isActive = data.active === "Y";
            if (!isActive) {
                try {
                    const response = await baseApiInstance.post("/widget/remove");
                    if (response.status != 200) {

                    } else {

                    }
                } catch (error) {

                }
            }

            return true;
        },

        init: async () => {                        
            return true;
        },

        bind_actions: async () => {
            
            return true;
        },

        loadPreloadedData: async function () {    
            return Promise.resolve({});
        },
        loadElements: function () {
            return Promise.resolve([]);
        },
        searchDataInCard: function (text, params) {
            return Promise.resolve([]);
        },
        linkCard: function (selected) {
            return Promise.resolve();
        },
        
        render: async () => {
            return true;            
        },

        dpSettings: async (data) => { 
            const fieldsWrap = document.querySelector("#widget_settings__fields_wrapper");
            if (!fieldsWrap) return true;

            const customInputEl = fieldsWrap.querySelector('input[name="custom"]');
            if (!customInputEl) return true;

            const customWrap =  
                customInputEl.closest(".widget_settings_block__item_field") ||
                customInputEl.parentElement?.parentElement;

            if (customWrap) customWrap.style.display = "none";

            const safeParse = (s) => {
                try {
                    return s ? JSON.parse(s) : {};
                } catch {
                    return {};
                }
            };

            const initialRawCustom = customInputEl.value ?? "";
            const initialCustomObj = safeParse(initialRawCustom);

            const setCustomRaw = (raw) => {
                customInputEl.value = raw;
                customInputEl.dispatchEvent(new Event("change", { bubbles: true }));
            };

            const onCustomSettingsUpdate = (patch) => {
                const next = { ...safeParse(customInputEl.value || ""), ...patch };
                setCustomRaw(JSON.stringify(next));
            };

            let mountNode = fieldsWrap.querySelector("#dp-settings-mount");
            if (!mountNode) {
                mountNode = document.createElement("div");
                mountNode.id = "dp-settings-mount";
                customWrap?.insertAdjacentElement("afterend", mountNode);
            }

            createRoot(mountNode).render(
                <DigitalPipelineSettings
                    prevCustomSettings={initialCustomObj}
                    onCustomSettingsUpdate={onCustomSettingsUpdate}
                />
            );

            return true;
        },


        advancedSettings: async () => {
            const targetElement = document.querySelector(".list-widget");
            createRoot(targetElement).render(
                <AdvancedSettings widget={widget} />
            );

            return true;
        },

        destroy: async () => {
            return true;
        },

        contacts: {
            selected: () => {
                return true;
            },
        },

        onSalesbotDesignerSave: function (handler_code, params) {
            return JSON.stringify([
                {
                    question: [
                        {
                            handler: 'widget_request',
                            params: {
                                url: `${apiBaseUrl}/salesbot/run`,
                                data: {
                                    pattern_id: params.template_id,
                                    lead_id: '{{lead.id}}',
                                    contact_id: '{{contact.id}}'
                                }
                            }
                        },
                    ]
                }
            ]);
        },
        
        todo: {
            selected: () => {},
        },

        onAddAsSource: () => {
            return true;
        },
    };

    return widget;
};

export default Widget;