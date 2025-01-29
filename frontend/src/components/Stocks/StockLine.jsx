import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const StockLine = ({ symbol, symbolName, startDate, endDate, interval }) => {
    const [history, setHistory] = useState(null);
    const [percentChange, setPercentChange] = useState(null);
    const [color, setColor] = useState("black");
    const [lastPrice, setLastPrice] = useState(null);
    const companyName = symbolName ? `(${symbolName})` : "";

    useEffect(() => {
        if (!symbol) return;

        const fetchHistory = async () => {
            let intervalData = interval;

            if (interval === "1day") intervalData = "30min";
            else if (interval === "5day") intervalData = "4h";
            else if (interval === "1month") intervalData = "1day";
            else if (interval === "6month") intervalData = "1day";
            else if (interval === "1year") intervalData = "1week";
            else if (interval === "5year") intervalData = "1month";

            try {
                const response = await fetch(
                    `http://localhost:5000/stocks/${symbol}/history?interval=${intervalData}&start_date=${startDate}&end_date=${endDate}`
                );
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }

                const historyData = await response.json();
                historyData.values = historyData.values.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

                setHistory(historyData);

                if (historyData.values.length > 0) {
                    const lastValue = historyData.values[historyData.values.length - 1].close;
                    setLastPrice(lastValue);

                    const firstValue = historyData.values[0].close;
                    const change = ((lastValue - firstValue) / firstValue) * 100;
                    setPercentChange(change);
                    setColor(change >= 0 ? "green" : "red");
                }
            } catch (error) {
                console.error("Error fetching stock history:", error);
            }
        };

        fetchHistory();
    }, [symbol, startDate, endDate, interval]);

    return (
        <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", boxShadow: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", marginRight: 1 }}>
                        {symbol} {companyName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#777", fontStyle: "italic" }}>
                        {companyName} Stock
                    </Typography>
                </div>

                <div>
                    {lastPrice !== null ? (
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#333",
                                fontWeight: "bold",
                            }}
                        >
                            {lastPrice}€
                        </Typography>
                    ) : (
                        <Typography variant="h5" sx={{ color: "#aaa" }}>
                            Loading...
                        </Typography>
                    )}
                    {percentChange !== null && (
                        <Typography
                            variant="body1"
                            sx={{
                                color: color,
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {percentChange.toFixed(2)}%
                            {color === "green" ? (
                                <ArrowUpward sx={{ color: "green", marginLeft: 1 }} />
                            ) : (
                                <ArrowDownward sx={{ color: "red", marginLeft: 1 }} />
                            )}
                        </Typography>
                    )}
                </div>
            </Box>

            <Divider sx={{ marginY: 0.5 }} />

            {/* Section date améliorée */}
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px", display: "inline-block", marginRight: "5px" }}>
                    From:
                </Typography>
                <Typography variant="body2" sx={{ color: "#333", fontSize: "14px", display: "inline-block", fontWeight: "bold" }}>
                    {startDate}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", fontSize: "14px", display: "inline-block", marginLeft: "10px", marginRight: "5px" }}>
                    To:
                </Typography>
                <Typography variant="body2" sx={{ color: "#333", fontSize: "14px", display: "inline-block", fontWeight: "bold" }}>
                    {endDate}
                </Typography>
            </Box>
        </Box>
    );
};

export default StockLine;
