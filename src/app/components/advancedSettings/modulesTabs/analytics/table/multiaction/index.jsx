import React from 'react';
import { Box, TableCell } from '@mui/material';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';

import BaseButton from './baseButton';


function MultiactionTableCell(
    {
        onResend,
        isResending,

        onCancelSending,
        isSendingCanceling,

        resendEnabled = true,
        cancelSendingEnabled = true,
    }
) {
    return ( 
        <TableCell
            colSpan={7}
            sx={{
                "&&": {
                    py: "0.3rem",
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: "1.5rem", 
                    alignItems: "center",
                }}
            >
                {
                    resendEnabled &&
                    <BaseButton
                        icon={<ReplayCircleFilledIcon sx={{ fontSize: "1rem", color: "var(--button_blue)"}} />} 
                        text={"Отправить повторно"}
                        onClick={onResend}
                        isLoading={isResending}
                    />
                }
                {
                    cancelSendingEnabled &&
                    <BaseButton
                        icon={<DoDisturbAltIcon sx={{ fontSize: "1rem", color: "#F26E6E"}} />} 
                        text={"Отменить отправку"}
                        onClick={onCancelSending}
                        isLoading={isSendingCanceling}
                    />
                }
            </Box>
        </TableCell>
    );
}

export default MultiactionTableCell;