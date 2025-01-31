import app from '../Server.js';
import request from 'supertest';

describe('Stock Routes', () => {
    test('GET /stocks should return stock list', async () => {
        const response = await request(app).get('/stocks');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data'); // Vérifie si l'objet contient des données
    });

    test('GET /stocks/:symbol should return stock details', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}`);
        console.log(response.body);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', symbol);
    });

    test('GET /stocks/:symbol/history should return historical data', async () => {
        const symbol = 'AAPL';
        const response = await request(app).get(`/stocks/${symbol}/history?interval=1day&start_date=2024-01-01&end_date=2024-01-10`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('values'); // Vérifie si l'historique est retourné
    });

    test('GET /stocks/:symbol with invalid symbol should return an error', async () => {
        const response = await request(app).get('/stocks/INVALID');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message');
    });
});