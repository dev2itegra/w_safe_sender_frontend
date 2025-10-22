import React, { useState, useEffect, useCallback } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

import {
    Box,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import styles from "./SettingsBlock.module.scss";
import { baseApiInstance } from "../../services/requests/axios.instance.js";
import { amoApiInstance } from "../../services/requests/amoAPI.js";
import { widgetCode, widgetIntegrationId } from "../../config.js";
import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification.js";
import { useThemeDetector } from "../../services/themes/themeDetector.js";
import { DescriptionButtons } from "./buttons.jsx";


const SettingsBlock = ({ widget }) => {
    const [widgetIsActive, setWidgetIsActive] = useState(widget?.params?.active === "Y");
    const [phoneNumber, setPhoneNumber] = useState(widget?.params?.phoneNumber || "");
    const [isSaving, setIsSaving] = useState(false);

    const theme = useThemeDetector();

    const handleChange = useCallback((newPhone) => {
        setPhoneNumber(newPhone);
    }, []);

    const isPhoneValid = matchIsValidTel(phoneNumber);

    const isDisabled = useCallback(() => {
        return (
            isSaving ||
            !isPhoneValid ||  
            !phoneNumber.trim() 
        );
    }, [isSaving, isPhoneValid, phoneNumber]);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!isPhoneValid) return; 

            setIsSaving(true);
            try {
                widget.params.phoneNumber = phoneNumber;
                
                const widgetSettings = widget.get_settings();
                
                const body = {
                    action: "edit",
                    id: widgetSettings.id,
                    code: widgetCode,
                    widget_active: "Y",
                    settings: {
                        phoneNumber,
                    },
                    is_widget_state_action: 0,
                    is_marketplace_request: 1,
                };

                const { data } = await amoApiInstance.post("/ajax/widgets/edit", body);
                    
                if (data.response.status === "ok") {
                    const response = await baseApiInstance.post("/widget/activation", {
                        phone_number: phoneNumber,
                    });
                    if (response.status === 200) {
                        const redirectUrl = `/settings/widgets/${widgetCode}`;
                        window.open(redirectUrl, "_self");
                        return;
                    }
                } else {
                    throw new Error("Unsuccessful amo widget settings editing");
                }

            } catch (error) {
                console.error("Widget activation error", error);
                sendAmoErrorNotification("Ошибка активации виджета");
            } finally {
                setIsSaving(false);
            }
        },
        [phoneNumber, widget, isPhoneValid]
    );

    return (
        <>
            <DescriptionButtons theme={theme} />
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "1rem",
                        borderRadius: "5px",
                        padding: "20px",
                        border: "1px solid var(--palette-border-default)",
                        backgroundColor: "var(--palette-background-default)",
                    }}
                >
                    <MuiTelInput
                        value={phoneNumber}
                        onChange={handleChange}
                        defaultCountry="RU"
                        preferredCountries={["RU"]}
                        size="small"
                        variant="outlined"
                        name="phoneNumber"
                        label="Номер телефона"
                        error={!!phoneNumber && !isPhoneValid}  // подсвечиваем невалидный ввод
                        // helperText={
                        //     !!phoneNumber && !isPhoneValid
                        //         ? "Введите корректный номер телефона"
                        //         : ""
                        // }
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <HintAdornment
                                        title="Этот номер будет использоваться для связи с вами в случае возникновения проблем."
                                        ariaLabel="подсказка по номеру техподдержки"
                                        theme={theme}
                                    />
                                ),
                            },
                        }}
                        sx={{
                            backgroundColor: theme === "dark" ? "#153043" : "rgba(255, 255, 255)",
                            marginBottom: "5px",
                            "& .MuiOutlinedInput-root": {
                                color: theme === "dark" ? "rgba(255, 255, 255)" : "rgba(0, 0, 0, 0.87)",
                                "& fieldset": { borderColor: "var(--palette-border-default)" },
                                "&:hover fieldset": { borderColor: theme === "dark" ? "#ffffff" : "#212121" },
                                "&.Mui-focused fieldset": { borderColor: theme === "dark" ? "#90caf9" : "#1976d2" },
                            },
                            "& .MuiInputLabel-root": {
                                color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                                "&.Mui-focused": { color: theme === "dark" ? "#90caf9" : "#1976d2" },
                            },
                            "& .MuiOutlinedInput-input::placeholder": { color: "var(--palette-border-default)", opacity: 1 },
                            "& .MuiSvgIcon-root": { fill: theme === "dark" ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0.54)" },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="outlined"
                        disabled={isDisabled()}
                        className={styles.saveButton}
                        startIcon={isSaving ? <CircularProgress size="20px" /> : null}
                        sx={{
                            color: theme === "dark" ? "#90caf9" : "#1976d2",
                            "&:disabled": {
                                color: theme === "dark"
                                    ? "rgba(255, 255, 255, 0.3)"
                                    : "rgba(0, 0, 0, 0.26)",
                                border: theme === "dark"
                                    ? "1px solid rgba(255, 255, 255, 0.12)"
                                    : "1px solid rgba(0, 0, 0, 0.12)",
                            },
                        }}
                    >
                        Настроить...
                    </Button>
                </Box>
            </form>
            <WidgetSettingsFooter accountId={window.APP?.constant?.("account")?.id} />
        </>
    );
};



// import React, { useState, useEffect, useCallback } from "react";
// import { MuiTelInput, matchIsValidTel } from "mui-tel-input";

// import {
//     Box,
//     Button,
//     InputAdornment,
//     IconButton,
//     CircularProgress,
//     TextField,
//     Tooltip,
// } from "@mui/material";
// import { Clear as ClearIcon } from "@mui/icons-material";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

// import styles from "./SettingsBlock.module.scss";
// import { baseApiInstance } from "../../services/requests/axios.instance.js";
// import { amoApiInstance } from "../../services/requests/amoAPI.js";
// import { widgetCode, widgetIntegrationId } from "../../config.js";
// import { sendAmoErrorNotification } from "../../services/amoNotification/sendNotification.js";
// import { useThemeDetector } from "../../services/themes/themeDetector.js";
// import { DescriptionButtons } from "./buttons.jsx";


// const SettingsBlock = ({ widget }) => {
//     const [widgetIsActive, setWidgetIsActive] = useState(widget?.params?.active === "Y" ? true : false);
//     const [phoneNumber, setPhoneNumber] = useState(widget?.params?.phoneNumber || "");
//     const [isSaving, setIsSaving] = useState(false);

//     const theme = useThemeDetector();

//     const handleChange = useCallback((newPhone) => {
//         setPhoneNumber(newPhone);
//     }, []);


//     const isDisabled = useCallback(() => {
//         return (
//             isSaving
//         );
//     }, [isSaving]);


//     const handleSubmit = useCallback(
//         async (e) => {
//             e.preventDefault();

//             setIsSaving(true);
//             try {
//                 widget.params.phoneNumber = phoneNumber;
                
//                 const widgetSettings = widget.get_settings();
                
//                 const body = {
//                     action: "edit",
//                     id: widgetSettings.id,
//                     code: widgetCode,
//                     widget_active: "Y",
//                     settings: {
//                         phoneNumber,
//                     },
//                     is_widget_state_action: 0,
//                     is_marketplace_request: 1,
//                 };

//                 const { data } = await amoApiInstance.post("/ajax/widgets/edit", body);
                    
//                 if ( data.response.status == "ok" ) {
//                     const response = await baseApiInstance.post(
//                         "/widget/activation", 
//                         {
//                             phone_number: phoneNumber,
//                         }
//                     );
//                     if ( response.status === 200) {
//                         const redirectUrl = `/settings/widgets/${widgetCode}`;
//                         window.open(redirectUrl, "_self");                        
//                         return;
//                     }
//                 } else {
//                     throw new Error("Unsuccessful amo widget settings editing")
//                 }

//             } catch (error) {
//                 console.error("Widget activation error", error);
//                 sendAmoErrorNotification(
//                     "Ошибка активации виджета",
//                 )
                
//             } finally {
//                 setIsSaving(false);
//             }
//         },
//         [phoneNumber, widget]
//     );

//     return (
//         <>
//             <DescriptionButtons theme={theme} />
//             <form onSubmit={handleSubmit}>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         rowGap: "1rem",
//                         borderRadius: "5px",
//                         padding: "20px",
//                         border: "1px solid var(--palette-border-default)",
//                         backgroundColor: "var(--palette-background-default)",
//                     }}
//                 >
//                     <MuiTelInput
//                         value={phoneNumber}
//                         onChange={handleChange}
//                         defaultCountry="RU"
//                         preferredCountries={["RU"]}
//                         size="small"
//                         variant="outlined"
//                         name="phoneNumber"
//                         label="Номер телефона"
//                         slotProps={{
//                             input: {
//                                 endAdornment: (
//                                     <HintAdornment
//                                         title="Этот номер будет использоваться для связи с вами в случае возникновения проблем."
//                                         ariaLabel="подсказка по номеру техподдержки"
//                                         theme={theme}
//                                     />
//                                 ),
//                             },
//                         }}
//                         sx={{
//                             backgroundColor: theme === "dark" ? "#153043" : "rgba(255, 255, 255)",
//                             marginBottom: "5px",
//                             "& .MuiOutlinedInput-root": {
//                                 color: theme === "dark" ? "rgba(255, 255, 255)" : "rgba(0, 0, 0, 0.87)",
//                                 "& fieldset": { borderColor: "var(--palette-border-default)" },
//                                 "&:hover fieldset": { borderColor: theme === "dark" ? "#ffffff" : "#212121" },
//                                 "&.Mui-focused fieldset": { borderColor: theme === "dark" ? "#90caf9" : "#1976d2" },
//                             },
//                             "& .MuiInputLabel-root": {
//                                 color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
//                                 "&.Mui-focused": { color: theme === "dark" ? "#90caf9" : "#1976d2" },
//                             },
//                             "& .MuiOutlinedInput-input::placeholder": { color: "var(--palette-border-default)", opacity: 1 },
//                             "& .MuiSvgIcon-root": { fill: theme === "dark" ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0.54)" },
//                         }}
//                     />

//                     <Button
//                         type="submit"
//                         variant="outlined"
//                         disabled={isDisabled()}
//                         className={styles.saveButton}
//                         startIcon={isSaving ? <CircularProgress size="20px" /> : null}
//                         sx={{
//                             color: theme === "dark" ? "#90caf9" : "#1976d2",
//                             "&:disabled" : {
//                                 color: theme === "dark"? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.26)",
//                                 border: theme === "dark"? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
//                             }
//                         }}
//                     >
//                         Настроить...
//                     </Button>
//                 </Box>
//             </form>
//             <WidgetSettingsFooter accountId={window.APP?.constant?.("account")?.id} />
//         </>
//     );
// };


function HintAdornment({ title, ariaLabel, theme }) {
    return (
        <InputAdornment position="end">
            <Tooltip title={title} enterDelay={300} arrow>
                <IconButton
                    edge="end"
                    size="small"
                    tabIndex={-1}
                    aria-label={ariaLabel}
                >
                    <HelpOutlineOutlinedIcon
                        fontSize="small"
                        sx={{
                            color:
                                theme === "dark"
                                    ? "rgba(255, 255, 255, 0.7) !important"
                                    : "rgba(0, 0, 0, 0.54) !important",
                        }}
                    />
                </IconButton>
            </Tooltip>
        </InputAdornment>
    );
}


function buildTelegramHref() {
    return `https://t.me/speechtwotext`;
}

function buildWhatsAppHref() {
    return `https://api.whatsapp.com/send/?phone=79152805424&text=start&type=phone_number&app_absent=0`;
}


export function WidgetSettingsFooter({
    accountId = typeof window !== "undefined" && window.APP?.constant?.("account")?.id,
}) {
    return (
        <Box
            sx={{
                ml: "-30px",
                mr: "-30px",
                mt: "30px",
                p: "15px",
                backgroundColor: "var(--palette-background-default)",
                borderTop: "1px solid var(--palette-border-default)",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ fontSize: "small", fontWeight: 500 }}>
                    Напишите нам для решения вашего вопроса
                </Box>

                <Box sx={{ pt: "10px" }}>
                    <LinkIcon
                        href={buildTelegramHref()}
                        ariaLabel="Написать в Telegram"
                    >
                        <svg width="25" height="25" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                        </svg>
                    </LinkIcon>

                    <LinkIcon
                        href={buildWhatsAppHref()}
                        ariaLabel="Написать в WhatsApp"
                    >
                        <svg width="25" height="25" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                        </svg>
                    </LinkIcon>

                    <LinkIcon
                        href="mailto:info@speech2text.ru"
                        ariaLabel="Написать на email"
                    >
                        <svg width="25" height="25" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V8l8 5 8-5zm-8-7L4 6h16z" />
                        </svg>
                    </LinkIcon>
                </Box>
            </Box>
        </Box>
    );
}

function LinkIcon({ href, ariaLabel, children }) {
    return (
        <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            sx={{
                color: "var(--color2)",
                width: "30px",
                height: "30px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mr: "6px",
                "& svg": {
                    borderRadius: "50%",
                    padding: "5px",
                    transition: "background-color 150ms ease-in-out",
                },
                "& svg:hover": {
                    backgroundColor: "var(--color23)",
                },
            }}
        >
            {children}
        </Box>
    );
}

export default SettingsBlock;


