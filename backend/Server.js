import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

import { startUsersService } from './services/users/index.js';
import { startTransactionsService } from './services/transactions/index.js';
import { stockRouter } from './services/stocks/stockRoutes.js';
import { newsRouter } from './services/news/newsRoutes.js';

app.use('/stocks', stockRouter);
app.use('/news', newsRouter);

startUsersService();
startTransactionsService();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;