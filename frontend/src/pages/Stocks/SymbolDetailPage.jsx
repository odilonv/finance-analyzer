import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SymbolDetailPage = () => {
    const { symbol } = useParams(); 
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!symbol) return; 
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocks/${symbol}`);
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [symbol]);

    return (
        <div style={{ padding: "20px" }}>
            {data ? (
                <div>
                    <h1>{data.symbol}</h1>
                    <p>{data.name}</p>
                    <p>{data.currency}</p>
                    <p>{data.exchange}</p>
                    <p>{data.price}</p>
                    <p>{data.change}</p>
                    <p>{data.percent_change}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SymbolDetailPage;