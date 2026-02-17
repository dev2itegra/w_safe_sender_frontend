import React from 'react';
import { TableRow, TableCell, Skeleton  } from '@mui/material';


function TableBodyRowLoading() {
    return ( 
        <TableRow>

            <TableCell align="center">
                <Skeleton variant="rounded" animation="wave" width="1rem" height="1rem" sx={{verticalAlign: "middle", display: "inline-block"}} />
            </TableCell>
            
            <TableCell>
                <Skeleton variant="rounded" animation="wave" width="90%" height="0.8125rem" />
            </TableCell>
            
            <TableCell>
                <Skeleton variant="rounded" animation="wave" width="80%" height="0.8125rem" />
            </TableCell>

            <TableCell>
                <Skeleton variant="rounded" animation="wave" width="80%" height="0.8125rem" />
            </TableCell>
            
            <TableCell>
                <Skeleton variant="rounded" animation="wave" width="90%" height="0.8125rem" />
            </TableCell>
            
            <TableCell 
                align="center"
            >
                <Skeleton variant="rounded" animation="wave" width="70%" height="0.8125rem" />
            </TableCell>
            
            <TableCell 
                align="left"
                sx={{
                    verticalAlign: "middle",
                }}    
            >
                <Skeleton variant="rounded" animation="wave" width="50%" height="0.8125rem" />
            </TableCell>

            <TableCell
                align="center"
            >
                <Skeleton variant="rounded" animation="wave" width="1rem" height="1rem" sx={{verticalAlign: "middle", display: "inline-block"}}  />
            </TableCell>
        </TableRow>
    );
}

export default TableBodyRowLoading;