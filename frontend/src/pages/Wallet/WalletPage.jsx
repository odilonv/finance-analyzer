import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { ButtonComponent, InputComponent, TransactionComponent } from '../../components';
import { useNavigate } from 'react-router';
import { useNotification } from '../../contexts/NotificationContext';
import { createTransaction, getTransactionsByUserId } from "../../services/API/ApiTransactions.js";

function WalletPage() {
    const { triggerNotification } = useNotification();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    
    
    const [newTransaction, setNewTransaction] = useState({
        ticker_id: '',
        amount: 0,
        buy_price: 0
    });

    const [transactions, setTransactions] = useState([]);

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
        navigate('/login');
    }

    return (
        <div style={{ margin: "15px" }}>
            <div>
                <DashboardCard title="Wallet" link="/wallet">
                    <form>
                        <InputComponent
                            label="Ticker ID"
                            validators={[value => value.length === 0 ? 'Required' : null]}
                            value={newTransaction.ticker_id}
                            setValue={value => setNewTransaction({ ...newTransaction, ticker_id: value })}
                        />
                        <InputComponent
                            label="Amount"
                            validators={[value => value < 0 ? 'Amount must be positive' : null]}
                            value={newTransaction.amount}
                            setValue={value => setNewTransaction({ ...newTransaction, amount: value })}
                        />
                        <InputComponent
                            label="Buy Price"
                            validators={[value => value < 0 ? 'Price must be positive' : null]}
                            value={newTransaction.buy_price}
                            setValue={value => setNewTransaction({ ...newTransaction, buy_price: value })}
                        />
                        <ButtonComponent onClick={handleCreateTransaction} text="Add Transaction" />
                    </form>

                    <h3 style={{ marginTop: '20px' }}>Your Transactions</h3>
                    <div>
                        {transactions.map(transaction => (
                            <TransactionComponent key={transaction.id} 
                            ticker_id={transaction.ticker_id} 
                            amount={transaction.amount} 
                            buy_price={transaction.buy_price} />
                        ))}
                    </div>
                    
                </DashboardCard>
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
    margin: '25px 50px 0 50px',
    alignItems: 'stretch'
};

const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '40%'
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

export default WalletPage;