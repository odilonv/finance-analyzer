import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbol, startDate, endDate, interval }) => {
    const [history, setHistory] = useState(null);
    const [percentChange, setPercentChange] = useState(null);
    const [color, setColor] = useState("black");

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
                console.log(historyData.values);
                historyData.values = historyData.values.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

                setHistory(historyData);

                if (historyData.values.length > 0) {
                    const firstValue = historyData.values[0].close;
                    const lastValue = historyData.values[historyData.values.length - 1].close;
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

    const chartData = {
        labels: history?.values?.map(item => item.datetime) || [],
        datasets: [
            {
                label: `${symbol} Stock Price`,
                data: history?.values?.map(item => item.close) || [],
                borderColor: "rgb(75, 192, 192)",
                // backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                {percentChange !== null && (
                    <Typography
                        variant="h5"
                        sx={{
                            marginLeft: "10px",
                            color: color,
                            fontWeight: "bold",
                        }}
                    >
                        {percentChange.toFixed(2)}%
                    </Typography>
                )}
            </Box>

            {history && history.values ? (
                <Line data={chartData} options={{ responsive: true }} />
            ) : (
                <Typography variant="body1" align="center">Loading chart data...</Typography>
            )}
        </Box>
    );
};

export default StockChart;
