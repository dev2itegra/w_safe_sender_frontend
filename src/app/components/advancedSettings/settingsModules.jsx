import React from "react";
import clsx from "clsx";

import styles from "./advancedSettings.module.scss";


const SettingsModules = ({ modules, selectedItem, onSelect }) => {
    return (
        <ul className={styles.modules}>
            {modules.map((module, index) => (
                <li
                    key={index}
                    className={clsx(
                        styles.module,
                        selectedItem.name === module.name && styles.selected
                    )}
                    onClick={() => onSelect(module)}
                >
                    {module.name}
                </li>
            ))}
        </ul>
    );
};

export default SettingsModules;
