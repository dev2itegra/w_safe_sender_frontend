import React from "react";
import { Box } from "@mui/material";

export function DescriptionButtons({ theme }) {
    const handleContactClick = () => {
        window.open(
            `https://t.me/speechtwotext`,
            "_blank"
        );
    };

    const handleInstructionClick = () => {
        window.open("https://speech2text.ru/integration/amocrm", "_blank");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                width: "100%",
                boxSizing: "border-box",
                mb: "20px",
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={handleInstructionClick}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50%",
                    boxSizing: "border-box",
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    height: "35px",
                    borderRadius: "4px",
                    color: theme === "dark" ? "rgba(0, 0, 0, 0.87)" : "#ffffff",
                    backgroundColor: "transparent",
                    border: "1px solid " + `${theme === "dark"? "rgba(144, 202, 249, 0.5)" : "rgba(108, 165, 211, 0.5)"}`,
                    textTransform: "uppercase",
                    transition:
                        "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "linear-gradient(#4c8bf7, #7fa6e8) !important",
                    cursor: "pointer",
                    p: "5px",
                    "&:hover": {
                        backgroundColor: theme === "dark"? "rgba(144, 202, 249, 0.1)" : "rgba(108, 165, 211, 0.1)",
                        borderColor: theme === "dark"? "rgba(144, 202, 249, 0.8)" : "rgba(108, 165, 211, 0.8)",
                        boxShadow:
                            "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, " +
                            "rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, " +
                            "rgba(0, 0, 0, 0.12) 0px 1px 10px 0px",
                    },
                    "& span": {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: "5px",
                    },
                }}
            >
                <span>
                    <svg
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                    >
                        <path d="m19 1-5 5v11l5-4.5zM1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5V6c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6m22 13.5V6c-.6-.45-1.25-.75-2-1v13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5v2c1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5z" />
                    </svg>
                </span>
                Инструкция
            </Box>
            <Box
                component="button"
                type="button"
                onClick={handleContactClick}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50%",
                    boxSizing: "border-box",
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    height: "35px",
                    borderRadius: "4px",
                    color: theme === "dark" ? "rgb(144, 202, 249)" : "rgb(25, 118, 210)",
                    backgroundColor: "transparent",
                    border: "1px solid " + `${theme === "dark"? "rgba(144, 202, 249, 0.5)" : "rgba(108, 165, 211, 0.5)"}`,
                    textTransform: "uppercase",
                    transition:
                        "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    p: "5px",
                    "&:hover": {
                        backgroundColor: theme === "dark"? "rgba(144, 202, 249, 0.1)" : "rgba(108, 165, 211, 0.1)",
                        borderColor: theme === "dark"? "rgba(144, 202, 249, 0.8)" : "rgba(108, 165, 211, 0.8)",
                    },
                    "& span": {
                        height: "18px",
                        width: "18px",
                        mr: "8px",
                        ml: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                <span>
                    <svg
                        width="18"
                        height="18"
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                    </svg>
                </span>
                Связь с нами
            </Box>
        </Box>
    );
}
