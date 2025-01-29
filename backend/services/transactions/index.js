import express from 'express';
import cors from 'cors';
import { transactionRouter } from './transactionRoutes.js';

const app = express();
const PORT = 5002;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use('/transactions', transactionRouter);
export const startTransactionsService = () => {
    app.listen(PORT, () => {
        console.log(`Transactions service is running on port ${PORT}`);
    });
};