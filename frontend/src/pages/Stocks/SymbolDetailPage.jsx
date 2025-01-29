import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Button, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid, Typography, Box } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SymbolDetailPage = () => {
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [history, setHistory] = useState(null);

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];
    const fiveDaysAgo = new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split("T")[0];
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0];
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split("T")[0];
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0];
    const fiveYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split("T")[0];

    const [interval, setInterval] = useState("1day");
    const [startDate, setStartDate] = useState(yesterday);
    const [endDate, setEndDate] = useState(today);

    useEffect(() => {
        if (!symbol) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocks/${symbol}`);
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchData();
    }, [symbol]);

    useEffect(() => {
        if (!symbol) return;

        const fetchHistory = async () => {
            let intervalData = interval;

            if (interval === "1day") intervalData = "30min";
            else if (interval === "5day") intervalData = "4h";
            else intervalData = "1day";

            try {
                const response = await fetch(
                    `http://localhost:5000/stocks/${symbol}/history?interval=${intervalData}&start_date=${startDate}&end_date=${endDate}`
                );
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const historyData = await response.json();
                console.log("historyData:", historyData);

                setHistory(historyData);
            } catch (error) {
                console.error("Error fetching stock history:", error);
            }
        };

        fetchHistory();
    }, [symbol, interval]);

    const handleIntervalChange = (event) => {
        setInterval(event.target.value);

        switch (event.target.value) {
            case "1day":
                setStartDate(yesterday);
                setEndDate(today);
                break;
            case "5day":
                setStartDate(fiveDaysAgo);
                setEndDate(today);
                break;
            case "1month":
                setStartDate(oneMonthAgo);
                setEndDate(today);
                break;
            case "6month":
                setStartDate(sixMonthsAgo);
                setEndDate(today);
                break;
            case "1year":
                setStartDate(oneYearAgo);
                setEndDate(today);
                break;
            case "5year":
                setStartDate(fiveYearsAgo);
                setEndDate(today);
                break;
            default:
                break;
        }
    };

    const chartData = {
        labels: history?.values?.map(item => item.datetime) || [],
        datasets: [
            {
                label: `${symbol} Stock Price`,
                data: history?.values?.map(item => item.close) || [],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <Box sx={{ padding: "20px", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
            {data ? (
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ backgroundColor: "#fff", borderRadius: "10px" }}>
                            <CardContent>
                                <Typography variant="h4" component="h1" gutterBottom align="center">
                                    {data.symbol}
                                </Typography>
                                <Typography variant="h6" align="center" color="text.secondary">
                                    {data.name}
                                </Typography>
                                <Typography variant="body1" align="center" color="text.primary" mt={2}>
                                    <strong>Currency:</strong> {data.currency}
                                </Typography>
                                <Typography variant="body1" align="center" color="text.primary">
                                    <strong>Exchange:</strong> {data.exchange}
                                </Typography>
                                <Typography variant="h6" align="center" color="text.primary" mt={2}>
                                    <strong>Price:</strong> {data.price}
                                </Typography>
                                <Typography variant="body2" align="center" color="text.secondary">
                                    <strong>Change:</strong> {data.change} <br />
                                    <strong>Percent Change:</strong> {data.percent_change}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={8}>
                        <Card variant="outlined" sx={{ backgroundColor: "#fff", borderRadius: "10px", padding: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom align="center">
                                    Stock Price History
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel>Interval</InputLabel>
                                        <Select value={interval} onChange={handleIntervalChange} label="Interval">
                                            <MenuItem value="1day">1 Day</MenuItem>
                                            <MenuItem value="5day">5 Days</MenuItem>
                                            <MenuItem value="1month">1 Month</MenuItem>
                                            <MenuItem value="6month">6 Months</MenuItem>
                                            <MenuItem value="1year">1 Year</MenuItem>
                                            <MenuItem value="5year">5 Years</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                {history && history.values ? (
                                    <Line data={chartData} options={{ responsive: true }} />
                                ) : (
                                    <Typography variant="body1" align="center">Loading chart data...</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6" align="center">Loading...</Typography>
            )}
        </Box>
    );
};

export default SymbolDetailPage;
