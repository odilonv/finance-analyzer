import express from 'express';

export const stockRouter = express.Router();

const API_KEY = process.env.API_KEY;

stockRouter.get('/', async (req, res) => {
    try {
        console.log("Fetching stock data...");
        
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
