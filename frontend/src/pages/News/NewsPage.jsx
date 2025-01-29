import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Pagination, CardMedia, Link, Skeleton } from "@mui/material";
import { Public, AccessTime } from "@mui/icons-material";
import { SearchBarComponent } from '../../components';

const NewsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Nouvelle variable d'état pour le chargement
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/news");
        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        setData(data.body);
        setFilteredData(data.body);
        setLoading(false); // Données chargées, donc on arrête le chargement
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false); // En cas d'erreur, on arrête aussi le chargement
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let updatedData = [...data];
    if (searchQuery) {
      updatedData = updatedData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(updatedData);
    setPage(1);
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <div style={titleStyle}>
        <h1>Stay Updated with the Latest <span style={{ color: 'var(--main-color)' }}>News</span> on the <span style={{ color: 'var(--main-color)' }}>Stock Market</span>.</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '50%' }}>
          <SearchBarComponent
            placeholder="Search News"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color="white"
            textColor="black"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '50%' }}>
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
          />
        </div>
      </div>

      <Grid container spacing={3}>
        {loading ? (
          // Affichage du skeleton pendant le chargement
          [...Array(itemsPerPage)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '10px' }} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" sx={{ marginBottom: 2 }} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="90%" sx={{ marginTop: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          displayedData.map((newsItem) => (
            <Grid item xs={12} sm={6} md={4} key={newsItem.url}>
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
                }}
              >
                {newsItem.img && (
                  <CardMedia
                    component="img"
                    image={newsItem.img}
                    alt={newsItem.title}
                    style={{ height: 200, objectFit: "cover", borderRadius: '10px' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Link
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      textDecoration: 'none',
                      color: 'black',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                      {newsItem.title}
                    </Typography>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <Public sx={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '16px' }} />
                    <Typography variant="body2" color="text.secondary">Source: <strong>{newsItem.source}</strong></Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <AccessTime sx={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '16px' }} />
                    <Typography variant="body2" color="text.secondary">
                      Date: <strong>{newsItem.time}</strong>
                    </Typography>
                  </div>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2, textAlign: 'left' }}>
                    {newsItem.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        />
      </div>
    </div>
  );
};

const titleStyle = {
  textAlign: 'left',
  marginBottom: '20px',
  paddingLeft: '10px',
};

export default NewsPage;
