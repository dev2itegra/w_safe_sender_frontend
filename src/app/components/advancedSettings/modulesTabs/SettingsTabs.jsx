import React, { useState } from "react";
import { Box } from "@mui/material";
import clsx from "clsx";

import styles from "../advancedSettings.module.scss";
import { modules } from "./modules";
import { useThemeDetector } from "../../../services/themes/themeDetector";


export function SettingsTabs({ ctx }) {    
    const theme = useThemeDetector();

    const [selectedItem, setSelectedItem] = useState(modules[0]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
            }}
        >
            <SettingsModules
                modules={modules}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
                ctx={ctx}
            />
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    position: "relative",

                    scrollbarGutter: "stable",

                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--palette-border-primary) var(--palette-background-default)",

                    "&::-webkit-scrollbar": { 
                        width: 8, 
                        height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                        marginBlock: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--palette-border-primary)", 
                        borderRadius: 8,
                        border: "2px solid transparent",
                        backgroundClip: "content-box",
                    },
                    "&:hover::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--palette-text-secondary-dark-green)",
                    },
                    "&::-webkit-scrollbar-corner": { 
                        background: "transparent" 
                    },
                }}
            >
                {selectedItem?.render && selectedItem.render(ctx)}
            </Box>
        </Box>
    );
}

const SettingsModules = ({ modules, selectedItem, onSelect, ctx }) => {
    return (
        <Box
            component="ul"
            className={styles.modules}
            sx={{
                m: 0,
                mb: "1.5rem",
                listStyle: "none",
                flexShrink: 0,
            }}
        >
            {modules.map((module, index) => (
                <Box
                    component="li"
                    key={index}
                    className={clsx(
                        styles.module,
                        selectedItem.name === module.name && styles.selected,
                        module.isDisabled && styles.disabled
                    )}
                    onClick={() => {
                        if (module.isDisabled) return;

                        if (module.isLink) {
                            window.open(module.getLink?.(ctx) ?? "#", "_blank");
                        } else {
                            onSelect(module);
                        }
                    }}
                >
                    {module.name}
                </Box>
            ))}
        </Box>
    );
};
