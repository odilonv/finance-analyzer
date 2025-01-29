import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StockChart } from "../../components";
import { Button, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid, Typography, Box } from "@mui/material";

const SymbolDetailPage = () => {
    const { symbol } = useParams();
    const [data, setData] = useState(null);

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

    return (
        <Box sx={{ padding: "20px", backgroundColor: "#f4f4f9" }}>
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
                        <Card variant="outlined">
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
                                <StockChart
                                    displayXLegend={true}
                                    symbol={symbol}
                                    startDate={startDate}
                                    endDate={endDate}
                                    interval={interval}
                                />
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
