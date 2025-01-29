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
    const [interval, setInterval] = useState("1day");

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
            try {
                const response = await fetch(
                    `http://localhost:5000/stocks/${symbol}/history?interval=${interval}`
                );
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const historyData = await response.json();
                setHistory(historyData);
            } catch (error) {
                console.error("Error fetching stock history:", error);
            }
        };

        fetchHistory();
    }, [symbol, interval]);

    const handleIntervalChange = (event) => {
        setInterval(event.target.value);
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
