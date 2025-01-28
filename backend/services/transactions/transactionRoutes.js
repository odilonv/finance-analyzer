import express from 'express';
import { IdTransaction, getTransactionById, getTransactionsByTickerId, getTransactionsByUserId, createTransaction, updateTransaction, deleteTransaction } from './transactionController.js';

export const transactionRouter = express.Router();

transactionRouter.get('/transaction/:id', IdTransaction);
transactionRouter.get('/:id', getTransactionById);
transactionRouter.get('/ticker/:ticker_id', getTransactionsByTickerId);
transactionRouter.get('/user/:user_id', getTransactionsByUserId);
transactionRouter.post('/', createTransaction);
transactionRouter.put('/:id', updateTransaction);
transactionRouter.delete('/:id', deleteTransaction);



