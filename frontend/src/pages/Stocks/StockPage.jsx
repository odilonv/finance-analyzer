import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, Card, CardContent, Typography, Grid, Pagination } from "@mui/material";
import { Business, AttachMoney, Public, SyncAlt, Storefront, Code } from "@mui/icons-material"; // Icônes MUI
import Skeleton from '@mui/material/Skeleton';

const StockPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchSymbol, setSearchSymbol] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/stocks/");
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const data = await response.json();
                setData(data.data);
                setFilteredData(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let updatedData = [...data];

        if (searchQuery) {
            updatedData = updatedData.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterCategory) {
            updatedData = updatedData.filter((item) => item.exchange === filterCategory);
        }

        setFilteredData(updatedData);
        setPage(1);
    }, [searchQuery, filterCategory, data]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const displayedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleSymbolSearch = (e) => {
        if (e.key === "Enter") {
            const stock = data.find(stock => stock.symbol === searchSymbol);
            if (stock) {
                navigate(`/stocks/${stock.symbol}`);
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                📈 Stock Market Data
            </Typography>

            <TextField
                label="🔎 Go to a symbol (AAPL, MSFT, GOOGL, TSLA, ... )"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                onKeyDown={handleSymbolSearch}
            />

            <TextField
                label="🔎 Search by Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                displayEmpty
                fullWidth
                style={{ marginBottom: "20px" }}
            >
                <MenuItem value="">All Exchanges</MenuItem>
                <MenuItem value="SZSE">Shenzhen Stock Exchange</MenuItem>
                <MenuItem value="NYSE">New York Stock Exchange</MenuItem>
                <MenuItem value="NASDAQ">NASDAQ</MenuItem>
            </Select>

            <Grid container spacing={3}>
                {
                    isLoading &&
                    Array.from({ length: 10 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4}>
                            <Skeleton animation="wave" key={index} variant="rectangular" width={400} height={270}
                                style={{ marginBottom: "10px" }} />
                        </Grid>
                    ))
                }
                {displayedData.map((stock) => (
                    <Grid item xs={12} sm={6} md={4} key={stock.figi_code}>
                        <Card variant="outlined" sx={{ padding: "15px", boxShadow: 3 }}>
                            <CardContent
                                onClick={() => {
                                    navigate(`/stocks/${stock.symbol}`);
                                }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    <Business /> {stock.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <SyncAlt /> Symbol: <strong>{stock.symbol}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <AttachMoney /> Currency: <strong>{stock.currency}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Storefront /> Exchange: <strong>{stock.exchange} ({stock.mic_code})</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Public /> Country: <strong>{stock.country}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Code /> Type: <strong>{stock.type}</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
            />
        </div>
    );
};

export default StockPage;
