import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CardMedia, Link, Skeleton, Grid } from "@mui/material";
import { NoEncryption } from "@mui/icons-material";

const NewsPreviewComponent = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/news");
        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        setNewsData(data.body.slice(0, 3)); // Limiter à 3 actualités
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <Grid container spacing={2} sx={{ paddingTop: 0 }}>
      {loading ? (
        [...Array(3)].map((_, index) => (
          <Grid item xs={4} key={index}>
            <Card variant="outlined" sx={{ backgroundColor: "white", padding: "16px", height: 180 }}>
              <Skeleton variant="rectangular" width="100%" height={70} sx={{ borderRadius: "10px" }} />
              <CardContent>
                <Skeleton variant="text" width="60%" sx={{ marginBottom: 1 }} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        newsData.map((newsItem) => (
          <Grid item xs={4} key={newsItem.url}>
            <Card variant="outlined" sx={{
              padding: '16px',
              backgroundColor: "var(--light-grey-1)",
              borderRadius: "10px",
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              minWidth: "180px",
              height: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: 'none',
            }}>

              {newsItem.img && (
                <CardMedia component="img" image={newsItem.img} alt={newsItem.title} sx={{ height: 70, objectFit: "cover", borderRadius: "10px" }} />
              )}
              <CardContent>
                <Link href={newsItem.url} target="_blank" rel="noopener" sx={{ textDecoration: "none", color: "black", "&:hover": { textDecoration: "underline" } }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, fontSize: "0.7rem" }}>
                    {newsItem.title}
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid >
  );
};

export default NewsPreviewComponent;
