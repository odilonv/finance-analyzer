import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./backend/.env') });

const API_KEY = process.env.API_KEY;
console.log("API_KEY dans stockRoutes:", API_KEY);

import express from 'express';

export const stockRouter = express.Router();

stockRouter.get('/', async (req, res) => {
    try {
        const response = await fetch(`https://api.twelvedata.com/stocks?apikey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        res.json(data); // Envoyer les données de l'API comme réponse
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

stockRouter.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await fetch(`https://api.twelvedata.com/quote?apikey=${API_KEY}&symbol=${symbol}`);
        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        res.json(data); // Envoyer les données de l'API comme réponse
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

stockRouter.get('/:symbol/history', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        console.log(`Fetching stock history for symbol ${symbol}...`);

        const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }
        const data = await response.json();
        res.json(data); // Envoyer les données de l'API comme réponse
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
