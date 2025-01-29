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
    const [percentChange, setPercentChange] = useState(null);
    const [color, setColor] = useState("black");

    useEffect(() => {
        if (!symbol) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocks/${symbol}`);
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const data = await response.json();
                console.log("data:", data);

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
                /* trier les données par date */
                historyData.values = historyData.values.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
                console.log("historyData:", historyData);

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
            {data && data.code === 429 ? (
                <Typography variant="h6" align="center">API rate limit exceeded. Please try again later.</Typography>
            ) : data ? (
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            padding: 1,
                            marginBottom: 1
                        }}>
                            <CardContent>
                                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: "#333", fontWeight: "bold" }}>
                                    {data.symbol}
                                </Typography>
                                <Typography variant="h6" align="center" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                    {data.name}
                                </Typography>
                                <Typography variant="body1" align="center" color="text.primary" mt={2} sx={{ fontWeight: "500" }}>
                                    <strong>Currency:</strong> {data.currency}
                                </Typography>
                                <Typography variant="body1" align="center" color="text.primary" sx={{ fontWeight: "500" }}>
                                    <strong>Exchange:</strong> {data.exchange}
                                </Typography>
                                <Typography variant="h6" align="center" color="text.primary" mt={2} sx={{ fontWeight: "bold", fontSize: "24px" }}>
                                    <strong>Price:</strong> {data.price}
                                </Typography>
                                <Typography variant="body2" align="center" color="text.secondary" sx={{ marginTop: "10px" }}>
                                    <strong>Change:</strong> {data.change} <br />
                                    <strong>Percent Change:</strong> {data.percent_change}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{
                            backgroundColor: "#fff",
                            borderRadius: "15px",
                            padding: 1,
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            marginTop: 1
                        }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ color: "#00796b", fontWeight: "bold", marginBottom: "20px" }}>
                                    <strong>Additional Information</strong>
                                </Typography>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: "500" }}>
                                        <strong>Average Volume:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: "500" }}>
                                        {data.average_volume}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: "500" }}>
                                        <strong>Volume:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: "500" }}>
                                        {data.volume}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Open Price:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {data.open}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Close Price:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {data.close}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Previous Close:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {data.previous_close}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Low Price:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {data.low}
                                    </Typography>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>High Price:</strong>
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {data.high}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>

                    </Grid>

                    <Grid item xs={12} sm={12} md={8}>
                        <Card variant="outlined" sx={{
                            backgroundColor: "#fff", borderRadius: "10px", padding: 3,
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom align="center">
                                    Stock Price History
                                </Typography>

                                <Box sx={{
                                    display: "flex", justifyContent: "center", marginBottom: "20px",
                                    alignItems: "center",
                                    // gap: "8%"
                                }}>
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
