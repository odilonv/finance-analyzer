import app from '../Server.js';
import request from 'supertest';

let server;

beforeAll(() => {
    server = app.listen(); // Start server if necessary
});

afterAll((done) => {
    server.close(done); // Close server to prevent open handles
});

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
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
    });
});