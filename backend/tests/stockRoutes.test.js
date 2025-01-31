import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { stockRouter } from '../routes/stocks.js'; // Assure-toi que le chemin est correct

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/stocks', stockRouter); // Ajoute le router

describe('Stock Routes', () => {
    test('GET /stocks should return stock list', async () => {
        const response = await request(app).get('/stocks');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    test('GET /stocks/:symbol should return stock details', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', symbol);
    });

    test('GET /stocks/:symbol/history should return historical data', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}/history?interval=1day&start_date=2024-01-01&end_date=2024-01-10`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('values');
    });

    test('GET /stocks/:symbol with invalid symbol should return an error', async () => {
        const response = await request(app).get('/stocks/INVALID');
        expect(response.status).toBe(404); // Change de 500 à 404
        expect(response.body).toHaveProperty('message', 'Stock not found');
    });
});
    