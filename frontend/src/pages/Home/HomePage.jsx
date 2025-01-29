import React, { useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { StockLine } from '../../components';

function HomePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const renderStockLine = () => {
        const stocks = [
            { symbol: "AAPL", symbolName: "Apple Inc." },
            { symbol: "MSFT", symbolName: "Microsoft Corporation" },
            { symbol: "AMZN", symbolName: "Amazon.com Inc." },
            { symbol: "TSLA", symbolName: "Tesla Inc." },
            { symbol: "NVDA", symbolName: "NVIDIA Corporation" },
            { symbol: "META", symbolName: "Meta Platforms Inc." },
            { symbol: "V", symbolName: "Visa Inc." },
        ];

        const startDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];
        const endDate = new Date().toISOString().split("T")[0];

        return (
            <DashboardCard title="Stocks" link="/stocks" autoScroll>
                {stocks.map((stock) => (
                    <StockLine
                        key={stock.symbol}
                        symbol={stock.symbol}
                        symbolName={stock.symbolName}
                        startDate={startDate}
                        endDate={endDate}
                        interval={"15min"}
                        onClick={() => {
                            navigate(`/stocks/${stock.symbol}`);
                        }}
                    />
                ))}
            </DashboardCard>
        );
    }

    if (user) {
        return (
            <div style={{ margin: "15px" }}>
                <div style={dashboardStyle}>
                    <div style={leftColumnStyle}>
                        <DashboardCard title="Market News" link="/news">
                            {/* Ajouter le component ici */}
                        </DashboardCard>
                        {renderStockLine()}
                    </div>
                    <DashboardCard title="Wallet" link="/wallet" style={rightCardStyle}>
                        {/* Ajouter le component ici */}
                    </DashboardCard>
                </div>
            </div>
        );
    }


    return (
        <div style={{ margin: "15px" }}>
            <div style={dashboardStyle}>
                <div style={{ ...cardStyle, justifyContent: 'center', alignItems: 'flex-start', height: '620px', paddingLeft: '50px', gap: '20px' }}>
                    <h1 style={{ textAlign: 'left' }}>
                        Welcome to <span style={{ color: 'var(--main-color)' }}>Finance Analyzer</span> !
                    </h1>
                    <p>Log in to access your personalized dashboard<br />and start managing your stock portfolio today.</p>
                    <Link to="/login" style={loginButtonStyle}>
                        Log In to Get Started <ArrowForwardIosRoundedIcon />
                    </Link>
                </div>

                <div style={rightColumnStyle}>
                    <DashboardCard title="Market News" link="/news">
                        {/* Ajouter le component ici */}
                    </DashboardCard>
                    {renderStockLine()}
                </div>
            </div>
        </div>
    );
}

const AutoScrollContainer = ({ children }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        let scrollAmount = 0;

        const scroll = () => {
            if (!scrollContainer) return;
            scrollAmount += 1; 
            if (scrollAmount >= scrollContainer.scrollWidth / 2) {
                scrollAmount = 0; 
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += 1;
            }
        };

        const interval = setInterval(scroll, 20); // Vitesse du défilement (50ms)
        return () => clearInterval(interval); 
    }, []);

    return (
        <div ref={scrollRef} style={scrollContainerStyle}>
            {children}
        </div>
    );
};

const DashboardCard = ({ title, link, style, children, autoScroll }) => (
    <div style={{ ...cardStyle, ...style }}>
        <h3 style={titleStyle}>{title}</h3>
        {autoScroll ? <AutoScrollContainer>{children}</AutoScrollContainer> : <div style={contentStyle}>{children}</div>}
        <Link to={link} style={arrowStyle}>
            <ArrowForwardIosRoundedIcon fontSize="small" />
        </Link>
    </div>
);

const scrollContainerStyle = {
    display: "flex",
    overflowX: "auto",
    gap: "16px",
    padding: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    whiteSpace: "nowrap",
    height: "100%",
};

const dashboardStyle = {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    margin: '30px 30px 0 30px',
    alignItems: 'stretch'
};

const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '50%'
};

const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '60%'
};

const rightCardStyle = {
    width: '65%',
    height: '620px'
};

const cardStyle = {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '300px'
};

const titleStyle = {
    textAlign: 'left',
    marginBottom: '10px'
};

const contentStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const arrowStyle = {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    color: 'var(--main-color)',
    textDecoration: 'none'
};

const loginButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--main-color)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    marginTop: '20px'
};

export default HomePage;