import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, Card, CardContent, Typography, Grid, Pagination, Skeleton, Box } from "@mui/material";
import { Business, AttachMoney, Public, SyncAlt, Storefront, Code } from "@mui/icons-material"; // Icônes MUI
import { SearchBarComponent } from '../../components'; // Assurez-vous que ce chemin est correct

const StockPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 15;
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
        <div style={{ padding: "20px", minHeight: "100vh" }}>
            <div style={titleStyle}>
                <h1>Dive into <span style={{ color: 'var(--main-color)' }}>Real-Time</span> Stock Market Data.</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '60%', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                        <SearchBarComponent
                            placeholder="Search for a symbol (AAPL, MSFT, GOOGL, ...)"
                            value={searchSymbol}
                            onChange={(e) => setSearchSymbol(e.target.value)}
                            onKeyDown={handleSymbolSearch}
                            color="white"
                            textColor="black"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <SearchBarComponent
                            placeholder="Search by Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            color="white"
                            textColor="black"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'end', width: '100%' }}>


                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        sx={{
                            '.MuiPaginationItem-root': {
                                color: 'var(--black)',
                            },
                            '.MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: 'var(--main-color)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'var(--main-color)',
                                }
                            }
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                    />
                    <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: 'var(--white)',
                            color: 'black',
                            fontWeight: '300',
                            height: '40px',
                            width: '30%',
                            borderRadius: '10px',
                        }}
                    >
                        <MenuItem value="">All Exchanges</MenuItem>
                        <MenuItem value="SZSE">Shenzhen Stock Exchange</MenuItem>
                        <MenuItem value="NYSE">New York Stock Exchange</MenuItem>
                        <MenuItem value="NASDAQ">NASDAQ</MenuItem>
                    </Select>
                </div>
            </div>



            <Grid container spacing={3}>
                {isLoading &&
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                    padding: '20px',
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Skeleton variant="text" width="80%" height={50} />
                                    <Skeleton variant="text" width="90%" height={18} />
                                    <Skeleton variant="text" width="90%" height={18} />
                                    <Skeleton variant="text" width="90%" height={18} />
                                    <Skeleton variant="text" width="60%" height={18} />
                                    <Skeleton variant="text" width="90%" height={18} />
                                    <Skeleton variant="text" width="60%" height={14} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }

                {displayedData.map((stock) => (
                    <Grid item xs={12} sm={6} md={4} key={stock.figi_code}>
                        <Card
                            variant="outlined"
                            sx={{
                                padding: '20px',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'var(--main-color)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    },
                                    '& svg': {
                                        color: 'white',
                                    },
                                },
                            }}
                            onClick={() => {
                                navigate(`/stocks/${stock.symbol}`);
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <Business sx={{ marginRight: 1 }} /> {stock.name}
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <SyncAlt sx={{ marginRight: 1 }} /> Symbol: <strong style={{ marginLeft: '5px' }}>{stock.symbol}</strong>
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <AttachMoney sx={{ marginRight: 1 }} /> Currency: <strong style={{ marginLeft: '5px' }}>{stock.currency}</strong>
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <Storefront sx={{ marginRight: 1 }} /> Exchange: <strong style={{ marginLeft: '5px' }}>{stock.exchange} ({stock.mic_code})</strong>
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <Public sx={{ marginRight: 1 }} /> Country: <strong style={{ marginLeft: '5px' }}>{stock.country}</strong>
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center">
                                        <Code sx={{ marginRight: 1 }} /> Type: <strong style={{ marginLeft: '5px' }}>{stock.type}</strong>
                                    </Box>
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
                sx={{
                    '.MuiPaginationItem-root': {
                        color: 'var(--black)',
                    },
                    '.MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: 'var(--main-color)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'var(--main-color)',
                        }
                    }
                }}
                style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
            />
        </div>
    );
};

const titleStyle = {
    textAlign: 'left',
    marginBottom: '20px',
    paddingLeft: '10px',
};

export default StockPage;
