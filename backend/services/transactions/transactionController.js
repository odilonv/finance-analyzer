import { TransactionService } from './transactionService.js';

export const IdTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await TransactionService.getTransactionById(id);
        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await TransactionService.getTransactionById(id);
        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getTransactionsByTickerId = async (req, res) => {
    const { ticker_id } = req.params;
    try {
        const transactions = await TransactionService.getTransactionsByTickerId(ticker_id);
        res.json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getTransactionsByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const transactions = await TransactionService.getTransactionsByUserId(user_id);
        res.json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const createTransaction = async (req, res) => {
    const { user_id, ticker_id, amount, buy_price } = req.body.transaction;
    try {
        const newTransaction = await TransactionService.createTransaction(user_id, ticker_id, amount, buy_price);
        res.status(201).json(newTransaction);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { user_id, ticker_id, amount, buy_price } = req.body.transaction;
    try {
        const updatedTransaction = await TransactionService.updateTransaction(id, user_id, ticker_id, amount, buy_price);
        if (updatedTransaction) {
            res.json(updatedTransaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const  deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await TransactionService.deleteTransaction(id);
        if (deleted) {
            res.json({ message: 'Transaction deleted' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
