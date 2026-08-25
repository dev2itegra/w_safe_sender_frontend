import React from "react";
import { createRoot } from "react-dom/client";

import SettingsBlock, { WidgetSettingsFooter } from "./components/settings/settingsBlock";
import AdvancedSettings from "./components/advancedSettings/advancedSettings";

import { baseApiInstance } from "./services/requests/axios.instance";
import DigitalPipelineSettings from "./components/DP";
import { sendAmoErrorNotification } from "./services/amoNotification/sendNotification";
import { widgetCode } from "./config";
import { sendInitData } from "./services/initData";


const Widget = (widget, Modal) => {
    widget.callbacks = {
        settings: function () {
            const fields = document.querySelector(".widget_settings_block__fields");
            if (!fields) return true;

            const container =
                fields.closest(".widget-settings") ||
                fields.closest(".modal") ||
                document.body;

            const title = container.querySelector(".widget_settings_block__title_field");
            if (title) title.style.display = "none";

            const amoInput = container.querySelector('input[name="phoneNumber"]');
            if (amoInput) amoInput.style.display = "none";

            const inputField = container.querySelector(".widget_settings_block__input_field");
            if (!inputField) return true;

            inputField.style.boxSizing = "border-box";
            inputField.style.width = "100%";

            const wrap = container.querySelector(".widget-settings__wrap-desc-space");
            if (wrap) wrap.style.paddingBottom = "0";

            const itemContainer = container.querySelector(".widget_settings_block__item_field");
            if (itemContainer) itemContainer.style.paddingBottom = "0";

            const controls = container.querySelector(".widget_settings_block__controls");
            if (controls) controls.style.margin = 0;

            let host = inputField.querySelector("#int2-settings-host");
            if (!host) {
                host = document.createElement("div");
                host.id = "int2-settings-host";
                host.style.width = "100%";
                host.style.display = "flex";
                host.style.flexDirection = "column";
                inputField.appendChild(host);
            }

            const SAVE_BTN_SEL = "button.js-widget-save";

            const placeSaveButton = () => {
                const saveBtn = container.querySelector(SAVE_BTN_SEL);
                if (!saveBtn) return;

                const text = saveBtn.querySelector(".button-input-inner__text");
                if (text && text.textContent !== "Настроить...") {
                    text.textContent = "Настроить...";
                }
                saveBtn.style.marginTop = "12px";
                saveBtn.style.alignSelf = "flex-start";

                const correctParent = inputField;
                const isInside = correctParent.contains(saveBtn);

                if (!isInside) {
                    if (host.nextSibling) {
                        correctParent.insertBefore(saveBtn, host.nextSibling);
                    } else {
                        correctParent.appendChild(saveBtn);
                    }
                }
            };

            placeSaveButton();

            const cleanupObservers = () => {
                if (window.__int2_watchSaveBtn) {
                    window.__int2_watchSaveBtn.disconnect();
                    delete window.__int2_watchSaveBtn;
                }
                if (window.__int2_hideErrors) {
                    window.__int2_hideErrors.disconnect();
                    delete window.__int2_hideErrors;
                }
            };

            const modalCloseBtn = container.querySelector(".modal__close");
            if (modalCloseBtn && !modalCloseBtn.__int2_cleanupBound) {
                modalCloseBtn.addEventListener(
                    "click",
                    () => {
                        cleanupObservers();
                    },
                    { once: true },
                );
                modalCloseBtn.__int2_cleanupBound = true;
            }

            if (!window.__int2_watchSaveBtn) {
                const moSaveBtn = new MutationObserver(() => placeSaveButton());
                moSaveBtn.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                });
                window.__int2_watchSaveBtn = moSaveBtn;
            }

            const hideErrors = () => {
                container
                    .querySelectorAll(".widget_settings_block__error")
                    .forEach((el) => {
                        el.style.setProperty("display", "none", "important");
                    });
            };

            hideErrors();

            if (!window.__int2_hideErrors) {
                const moErrors = new MutationObserver(() => hideErrors());
                moErrors.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ["style", "class"],
                });
                window.__int2_hideErrors = moErrors;
            }

            const syncAmoPhone = (val) => {
                if (val) {
                    container
                        .querySelectorAll('input[name="phoneNumber"]')
                        .forEach((el) => {
                            el.value = val;
                            el.setAttribute("value", val);
                            el.dispatchEvent(new Event("input", { bubbles: true }));
                            el.dispatchEvent(new Event("change", { bubbles: true }));
                            el.dispatchEvent(new Event("blur", { bubbles: true }));
                        });
                }
            };

            const settingsRoot = createRoot(host);
            settingsRoot.render(<SettingsBlock widget={widget} syncAmoPhone={syncAmoPhone} />);

            let footer = inputField.querySelector("#int2-settings-footer");
            if (!footer) {
                footer = document.createElement("div");
                footer.id = "int2-settings-footer";
                footer.style.width = "100%";
                footer.style.display = "flex";
                footer.style.flexDirection = "column";
                inputField.appendChild(footer);
            }
            const footerRoot = createRoot(footer);
            footerRoot.render(<WidgetSettingsFooter widget={this} />);

            return true;
        },


        onSave: async (data) => {
            const isActive = data.active === "Y";

            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

            const shouldRetry = (error) => {
                const status = error?.response?.status;
                return !status || status >= 500;
            };

            const nextDelay = (attempt, base = 2000, max = 30000) => {
                const pure = Math.min(max, base * 2 ** attempt);
                const jitter = 0.7 + Math.random() * 0.6; 
                return Math.floor(pure * jitter);
            };

            if (!isActive) {
                try {
                    const response = await baseApiInstance.post("/widget/remove");
                    if (response.status !== 200) {
                        throw new Error(`Remove returned non-200: ${response.status}`);
                    }
                } catch (error) {
                    console.error("Widget remove error:", error);
                }
            } else {
                const phoneNumber = String(data?.fields?.phoneNumber || "");
                const maxRetries = 5;

                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    try {
                        const response = await baseApiInstance.post(
                            "/widget/activation", 
                            {
                                phone_number: phoneNumber,
                            },
                        );

                        if (response.status === 200) {
                            const redirectUrl = `/settings/widgets/${widgetCode}`;
                            window.open(redirectUrl, "_blank");
                            break;
                        }

                        throw new Error(`Activation non-200: ${response.status}`);

                    } catch (error) {
                        const canRetry = shouldRetry(error) && attempt < maxRetries;
                        if (!canRetry) {
                            console.error("Widget activation error:", error);
                            sendAmoErrorNotification("Ошибка активации виджета");
                            break;
                        }

                        const delay = nextDelay(attempt);
                        await sleep(delay);
                    }
                }
            }

            return true;
        },


        init: async () => {    
            try {
                await sendInitData();             
            } catch {

            }
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
