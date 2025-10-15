import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { useThemeDetector } from "../../services/themes/themeDetector";


export default function Hint({ title, ariaLabel }) {
    const theme = useThemeDetector()
    
    return (
        <Tooltip
            title={title}
            enterDelay={300}
            arrow
            disableInteractive={false}
        >
            <IconButton
                edge="end"
                size="small"
                tabIndex={-1}
                aria-label={ariaLabel}
                sx={{p: 0}}
            >
                <HelpOutlineOutlinedIcon
                    fontSize="small"
                    sx={{
                        color: "var(--palette-border-default) !important"
                            // theme === "dark"
                            //     ? "var(--palette-border-default)"
                            //     : "var(--palette-text-secondary-dark-green)",
                    }}
                />
            </IconButton>
        </Tooltip>
    );
}
