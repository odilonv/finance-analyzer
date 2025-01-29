import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./backend/.env') });

export const newsRouter = express.Router();

const YAHOO_API_KEY = process.env.YAHOO_API_KEY;
console.log("API_KEY dans newsRoute:", YAHOO_API_KEY);


newsRouter.get('/', async (req, res) => {
  // Liste des tickers d'actions pour lesquelles tu veux récupérer les news
  const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

  const tickerQuery = tickers.join(',');

  try {
    const url = `https://yahoo-finance15.p.rapidapi.com/api/v2/markets/news?tickers=${tickerQuery}&type=ALL`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': YAHOO_API_KEY,
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
      }
    };

    // Faire la requête
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch stock news: ${response.status}`);
    }

    // Extraire les données des news
    const data = await response.json();

    // Retourner les données de news sous forme JSON
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Route pour récupérer les news d'une action spécifique
newsRouter.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    console.log(`Fetching news for ${symbol}...`);

    // URL de l'API Yahoo Finance
    const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${symbol}`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': YAHOO_API_KEY,
        'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
      }
    };

    // Faire la requête avec fetch
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch news for ${symbol}: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
