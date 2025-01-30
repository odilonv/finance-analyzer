import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import { useNotification } from '../../contexts/NotificationContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

import { createTransaction, getTransactionsByUserId, deleteTransaction } from "../../services/API/ApiTransactions.js";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { color } from '@mui/system';

function WalletPage() {
    const [errors, setErrors] = useState({});
    const { triggerNotification } = useNotification();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [newTransaction, setNewTransaction] = useState({
        ticker_id: '',
        amount: '',
        buy_price: ''
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
            setTransactions(userTransactions || []);
            if (userTransactions && userTransactions.length > 0) {
                fetchStockPrices(userTransactions);
            }
        } catch (error) {
            console.error(error);
            triggerNotification('Failed to load transactions', 'error');
            setTransactions([]); // Empêche la page de planter en cas d'erreur
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

    const handleDeleteTransaction = async (transactionId) => {
        try {
            await deleteTransaction(transactionId);
            triggerNotification('Transaction deleted successfully', 'success');
            setTransactions(transactions.filter(t => t.id !== transactionId));
        } catch (error) {
            console.error(error);
            triggerNotification('Error deleting transaction', 'error');
        }
    };

    return (
        <div style={{ margin: "20px" }}>
            <div class="title-style">
                <h1> <span style={{ color: 'var(--main-color)' }}>Manage</span> Your Investments with Ease <span style={{ color: 'var(--main-color)' }}></span>.</h1>
            </div>
            
            <div>
                <div className="cardStyle">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Your Transactions</h3>
                    </div>
                    <div id="transaction-header">
                        <div className="ticker-id">Ticker ID</div>
                        <div className="amount">Amount</div>
                        <div className="buy-price">Current value</div>
                        <div className="icon transaction-button"
                        style={{ cursor: 'pointer', color: 'white' }}>
                            <Button 
                                onClick={() => setShowForm(!showForm)}
                                variant="contained" 
                                sx={{ backgroundColor: "var(--main-color)", color: "#fff", "&:hover": { backgroundColor: "var(--main-color)" } }}>
                                Ajouter
                                <AddRoundedIcon/>
                            </Button>
                        </div>
                    </div>

                    <div id="transactions-list" style={{ marginTop: '20px' }}>
                        {transactions.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'gray', marginTop: '20px' }}>
                                Aucune transaction enregistrée.
                            </p>
                        ) : (Object.keys(groupedTransactions).map(ticker => {
                            const totalAmount = groupedTransactions[ticker].reduce((sum, t) => sum + t.amount, 0);
                            const totalValue = groupedTransactions[ticker].reduce((sum, t) => sum + (t.amount * t.buy_price), 0);
                            const latestPrice = stockPrices[ticker] || 0;
                            const valueDifference = latestPrice * totalAmount -  totalValue;
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
                                                        <div className="ticker-id">
                                                            <Button 
                                                                onClick={() => handleDeleteTransaction(transaction.id)} 
                                                                sx={{ color: 'grey', minWidth: '30px' }}>
                                                                <CloseRoundedIcon />
                                                            </Button>
                                                        </div>
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
                        }))
                    }
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
                        <Button 
                            onClick={() => setShowForm(false)} 
                            variant="outlined" 
                            sx={{ color: "var(--main-color)", borderColor: "var(--main-color)" }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateTransaction} 
                            variant="contained" 
                            sx={{ backgroundColor: "var(--main-color)", color: "#fff", "&:hover": { backgroundColor: "var(--main-color)" } }}
                        >
                            <CheckRoundedIcon />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div> 
        </div>
    );
}

export default WalletPage;
