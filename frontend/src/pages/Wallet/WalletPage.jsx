import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import { useNotification } from '../../contexts/NotificationContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

import { createTransaction, getTransactionsByUserId } from "../../services/API/ApiTransactions.js";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function WalletPage() {
    const [errors, setErrors] = useState({});
    const { triggerNotification } = useNotification();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [newTransaction, setNewTransaction] = useState({
        ticker_id: '',
        amount: 0,
        buy_price: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [expandedTickers, setExpandedTickers] = useState({});
    const [stockPrices, setStockPrices] = useState({});

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const userTransactions = await getTransactionsByUserId(user.id);
            setTransactions(userTransactions);
            fetchStockPrices(userTransactions);
        } catch (error) {
            console.error(error);
            triggerNotification('Failed to load transactions', 'error');
        }
    };

    const fetchStockPrices = async (userTransactions) => {
        const tickers = [...new Set(userTransactions.map(t => t.ticker_id))];
        const prices = {};
        for (const ticker of tickers) {
            try {
                // const response = await fetch(`http://localhost:5000/stocks/${ticker}`);
                // prices[ticker] = response.open;
                // console.log(prices);
                // modifier 

                prices[ticker] = Math.floor(Math.random() * 1000) + 10;
            } catch (error) {
                console.error(`Failed to fetch stock price for ${ticker}`, error);
            }
        }
        setStockPrices(prices);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newTransaction.ticker_id.trim()) {
            newErrors.ticker_id = "Ticker ID is required";
        }
        if (!newTransaction.amount || newTransaction.amount <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }
        if (!newTransaction.buy_price || newTransaction.buy_price <= 0) {
            newErrors.buy_price = "Buy Price must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateTransaction = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const transactionData = {
                ...newTransaction,
                user_id: user.id,
                amount: parseFloat(newTransaction.amount),
                buy_price: parseFloat(newTransaction.buy_price),
            };

            const transaction = await createTransaction(transactionData);
            if (transaction.id) {
                triggerNotification('Transaction created', 'success');
                setTransactions([...transactions, transaction]);
                setShowForm(false);
                setNewTransaction({ ticker_id: '', amount: '', buy_price: '' });
                setErrors({});
            } else {
                triggerNotification('Error creating transaction', 'error');
            }
        } catch (error) {
            console.error(error);
            triggerNotification('An error occurred', 'error');
        }
    };

    const toggleExpand = (ticker) => {
        setExpandedTickers(prev => ({
            ...prev,
            [ticker]: !prev[ticker]
        }));
    };

    if (!user) {
        navigate('/login');
    }

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.ticker_id]) {
            acc[transaction.ticker_id] = [];
        }
        acc[transaction.ticker_id].push(transaction);
        return acc;
    }, {});

    return (
        <div style={{ margin: "20px 10%" }}>
            <div className="cardStyle">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Your Transactions</h3>
                </div>
                <div id="transaction-header">
                    <div className="ticker-id">Ticker ID</div>
                    <div className="amount">Amount</div>
                    <div className="buy-price">Current value</div>
                    <div className="icon">
                        <AddRoundedIcon
                            className="icon"
                            style={{ cursor: 'pointer', fontSize: 30, color: 'var(--main-color)' }}
                            onClick={() => setShowForm(!showForm)}
                        />
                    </div>
                </div>

                <div id="transactions-list" style={{ marginTop: '20px' }}>
                    {showForm && (
                        <form id="transaction-form" onSubmit={handleCreateTransaction}>
                            <div className="ticker-id transaction-input-container">
                                <input
                                    className="transaction-input"
                                    type="text"
                                    placeholder="Ticker ID"
                                    value={newTransaction.ticker_id}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, ticker_id: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="amount transaction-input-container">
                                <input
                                    className="transaction-input"
                                    type="number"
                                    placeholder="Amount"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="buy-price transaction-input-container">
                                <input
                                    className="transaction-input"
                                    type="number"
                                    placeholder="Buy Price"
                                    value={newTransaction.buy_price}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, buy_price: parseFloat(e.target.value) })}
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="icon">
                                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <CheckRoundedIcon style={{ fontSize: 24, color: 'var(--main-color)' }} />
                                </button>
                            </div>
                        </form>
                    )}

                    {Object.keys(groupedTransactions).map(ticker => {
                        const totalAmount = groupedTransactions[ticker].reduce((sum, t) => sum + t.amount, 0);
                        const totalValue = groupedTransactions[ticker].reduce((sum, t) => sum + (t.amount * t.buy_price), 0);
                        const latestPrice = stockPrices[ticker] || 0;
                        const valueDifference = latestPrice * totalAmount -  totalValue;
                        console.log(ticker+ "\nTP : " + totalValue + " \nTAP :  " + latestPrice * totalAmount + " \nDIF : " + valueDifference);

                        return (
                            <div key={ticker} style={{ marginBottom: '15px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px',
                                        background: '#f5f5f5',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => toggleExpand(ticker)}
                                >
                                    <div className="ticker-id ticker-header">
                                        {ticker}
                                    </div>
                                    <div className="amount">{totalAmount}</div>
                                    <div className="buy-price">{latestPrice.toFixed(2)} $</div>
                                    <div className="icon">
                                        {valueDifference && (
                                            <>
                                                <span style={{ marginRight:'10px', textAlign:'left' ,color: valueDifference > 0 ? 'green' : 'red' }}>
                                                 {valueDifference.toFixed(2)} $
                                                </span>
                                                <span style={{ color: valueDifference > 0 ? 'green' : 'red' }}>
                                                { (valueDifference * 100 / totalValue * totalAmount).toFixed(2)}%
                                                </span>
                                            </>
                                        )}
                                        {expandedTickers[ticker] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </div>
                                </div>

                                {expandedTickers[ticker] && (
                                    <div style={{ padding: '10px' }}>
                                        {groupedTransactions[ticker].map(transaction => {
                                            const individualValue = transaction.amount * transaction.buy_price;
                                            const individualPrice = stockPrices[ticker] || 0;
                                            const individualDifference = individualPrice * transaction.amount - individualValue;
                                            return (
                                                <div key={transaction.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                                                    <div className="ticker-id">{transaction.ticker_id}</div>
                                                    <div className="amount">{transaction.amount}</div>
                                                    <div className="buy-price">
                                                        ${transaction.buy_price.toFixed(2)} 
                                                    </div>
                                                    <div className="icon">{individualPrice && (
                                                            <>
                                                                <span style={{ marginRight:'10px', color: individualDifference > 0 ? 'green' : 'red' }}>
                                                                    {individualDifference.toFixed(2)} $ 
                                                                </span>
                                                                <span style={{ color: individualDifference > 0 ? 'green' : 'red' }}>
                                                                { (individualDifference * 100 / individualPrice * transaction.amount).toFixed(2)}%
                                                                </span>
                                                            </>
                                                        )}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Dialog open={showForm} onClose={() => setShowForm(false)}>
                <DialogTitle>New Transaction</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Ticker ID"
                        margin="dense"
                        value={newTransaction.ticker_id}
                        onChange={(e) => setNewTransaction({ ...newTransaction, ticker_id: e.target.value })}
                        required
                        error={!!errors.ticker_id}
                        helperText={errors.ticker_id}
                    />
                    <TextField
                        fullWidth
                        label="Amount"
                        margin="dense"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        required
                        error={!!errors.amount}
                        helperText={errors.amount}
                        inputProps={{ min: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Buy Price"
                        margin="dense"
                        type="number"
                        value={newTransaction.buy_price}
                        onChange={(e) => setNewTransaction({ ...newTransaction, buy_price: e.target.value })}
                        required
                        error={!!errors.buy_price}
                        helperText={errors.buy_price}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button onClick={handleCreateTransaction} color="primary" variant="contained">
                        <CheckRoundedIcon />
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default WalletPage;
