import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const StockLine = ({ symbol, symbolName, lastPrice, percentChange, color, onClick }) => {
    return (
        <Box
            sx={{
                padding: '20px',
                backgroundColor: "var(--light-grey-1)",
                borderRadius: "10px",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                minWidth: "180px",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            onClick={onClick}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: "bold",
                        color: "#333",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                    }}
                >
                    {symbol}
                </Typography>
                <Typography variant="caption" sx={{ color: "#4a4a4a", whiteSpace: "normal" }}>
                    {symbolName}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {lastPrice !== null ? (
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#333",
                            fontWeight: "bold",
                        }}
                    >
                        {lastPrice} €
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={50} height={24} />
                )}

                {percentChange !== null && percentChange !== undefined ? (
                    <Typography
                        variant="body2"
                        sx={{
                            color: color,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {percentChange.toFixed(2)}%
                        {color === "green" ? (
                            <ArrowUpward sx={{ color: "green", fontSize: 16, marginLeft: 0.5 }} />
                        ) : (
                            <ArrowDownward sx={{ color: "red", fontSize: 16, marginLeft: 0.5 }} />
                        )}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width={40} height={20} />
                )}
            </Box>
        </Box>
    );
};

export default StockLine;

