import React from 'react';
import { TableCell, Checkbox, } from '@mui/material';
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";


function CheckboxTableCell(
    { 
        disabled,
        checked,
        setIsChecked = () => {},
    }
) {
    return ( 
        <TableCell
            padding="checkbox"
            sx={{
                width: 32,
                minWidth: 32,
                maxWidth: 32,
                p: 0,
                m: 0,
                textAlign: "center",
                verticalAlign: "middle",
                borderRight: "1px solid var(--palette-border-primary)",
                "& .MuiCheckbox-root": {
                    color: "var(--palette-border-default)",
                },
                "& .MuiCheckbox-root.Mui-checked": {
                    color: "var(--palette-border-default)",
                }
            }}
        >
            <Checkbox
                disableRipple
                size="small"
                icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />}
                checkedIcon={<CheckBoxIcon sx={{ fontSize: 16 }} />}
                sx={{ p: 0, m: 0 }}
                disabled={disabled}
                checked={checked}
                onChange={(e) => {setIsChecked(e.target.checked)}}
            />
        </TableCell>
    );
}

export default CheckboxTableCell;