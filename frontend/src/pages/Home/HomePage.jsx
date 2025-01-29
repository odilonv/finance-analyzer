import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { ButtonComponent, InputComponent } from '../../components';
import { useNotification } from '../../contexts/NotificationContext';
import { createTransaction, getTransactionsByUserId } from "../../services/API/ApiTransactions.js";

function WalletPage() {
    const { triggerNotification } = useNotification();
    const { user } = useContext(UserContext);
    
    const [newTransaction, setNewTransaction] = useState({
        ticker_id: '',
        amount: 0,
        buy_price: 0
    });

    const [transactions, setTransactions] = useState([]);

    // 🔹 Récupération des transactions de l'utilisateur
    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const userTransactions = await getTransactionsByUserId(user.id);
            setTransactions(userTransactions);
        } catch (error) {
            console.error(error);
            triggerNotification('Failed to load transactions', 'error');
        }
    };

    const handleCreateTransaction = async () => {
        try {
            newTransaction.user_id = user.id;
            const transaction = await createTransaction(newTransaction);
            if (transaction.id) {
                triggerNotification('Transaction created', 'success');
                setTransactions([...transactions, transaction]); // Ajout immédiat
            } else {
                triggerNotification('Error creating transaction', 'error');
            }
        } catch (error) {
            console.error(error);
            triggerNotification('An error occurred', 'error');
        }
    };

    if (!user) {
        return (
            <div style={{ margin: "15px" }}>
                <div style={dashboardStyle}>
                    <div style={leftColumnStyle}>
                        <DashboardCard title="Market News" link="/news">
                            {/* Ajouter le component ici */}
                        </DashboardCard>
                        <DashboardCard title="Stocks" link="/stocks">
                            {/* Ajouter le component ici */}
                        </DashboardCard>
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
                    <DashboardCard title="Stocks" link="/stocks">
                        {/* Ajouter le component ici */}
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
}

const DashboardCard = ({ title, link, style, children }) => (
    <div style={{ ...cardStyle, ...style }}>
        <h3 style={titleStyle}>{title}</h3>
        <div style={contentStyle}>{children}</div>
        <Link to={link} style={arrowStyle}>
            <ArrowForwardIosRoundedIcon fontSize="small" />
        </Link>
    </div>
);

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
    justifyContent: 'space-between'
};

const titleStyle = {
    textAlign: 'left',
    marginBottom: '10px'
};

const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const arrowStyle = {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    color: 'var(--main-color)',
    textDecoration: 'none'
};

const centeredContainerStyle = {
    margin: "15px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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

export default WalletPage;
