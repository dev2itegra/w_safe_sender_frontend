import React from "react";
import { Box, Pagination } from "@mui/material";

export function PaginationBlock(
    {
        currentPage, 
        setCurrentPage, 
        maxPage,
        isLoading,
    }
) {
    return (
        
        <Box
        sx={{
            width: "100%",
            background: "var(--palette-background-primary)",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
            <Pagination 
                boundaryCount={1}
                count={maxPage}
                defaultPage={1}
                hideNextButton={currentPage === maxPage || currentPage === (maxPage - 1)}
                hidePrevButton={currentPage === 1 || currentPage === 2}
                onChange={
                    (e, p) => {
                        setCurrentPage(p);
                    }
                }
                page={currentPage}
                shape="rounded"
                sx={{
                    "& .MuiPaginationItem-root" : {
                        color: "var(--palette-text-primary)",
                    }
                }}
                disabled={isLoading}

            />  
        </Box>
    )
}
