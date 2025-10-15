import React, { useState } from "react";
import { Box } from "@mui/material";
import clsx from "clsx";


import styles from "../transcription.module.scss";
import { modules } from "./modules";

export function ModalTabs({ ctx }) {
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
      <TranscriptionModules
        modules={modules}
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
      />
      <Box
        sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "scroll",
            position: "relative",
            maxHeight: "30rem",

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

const TranscriptionModules = ({ modules, selectedItem, onSelect }) => {
  return (
    <Box
      component="ul"
      className={styles.modules}
      sx={{ m: 0, p: "0 0.5rem", listStyle: "none", flexShrink: 0, userSelect: "none" }}
    >
      {modules.map((module, index) => (
        <li
          key={index}
          className={clsx(
            styles.module,
            selectedItem.name === module.name && styles.selected,
            module.isDisabled && styles.disabled
          )}
          onClick={() => !module.isDisabled && onSelect(module)}
        >
          {module.name}
        </li>
      ))}
    </Box>
  );
};
