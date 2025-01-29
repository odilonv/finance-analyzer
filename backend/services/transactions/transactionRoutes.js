import express from 'express';
import { getTransactionById, getTransactionsByTickerId, getTransactionsByUserId, createTransaction, updateTransaction, deleteTransaction } from './transactionController.js';

export const transactionRouter = express.Router();

transactionRouter.post('/', createTransaction);
transactionRouter.get('/:id', getTransactionById);
transactionRouter.get('/ticker/:ticker_id', getTransactionsByTickerId);
transactionRouter.get('/user/:user_id', getTransactionsByUserId);
transactionRouter.put('/:id', updateTransaction);
transactionRouter.delete('/:id', deleteTransaction);



