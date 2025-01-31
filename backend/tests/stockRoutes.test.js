import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { stockRouter } from '../services/stocks/stockRoutes.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/stocks', stockRouter); 

describe('Stock Routes', () => {
    test('GET /stocks should return stock list', async () => {
        const response = await request(app).get('/stocks');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    }, 20000); 

    test('GET /stocks/:symbol should return stock details', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', symbol);
    }, 20000);

    test('GET /stocks/:symbol/history should return historical data', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}/history?interval=1day&start_date=2024-01-01&end_date=2024-01-10`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('values');
    }, 20000); 

    test('GET /stocks/:symbol with invalid symbol should return an error', async () => {
        const response = await request(app).get('/stocks/INVALID');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    }, 20000); 
});