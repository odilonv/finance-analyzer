// backend/server.js
import express from 'express';
import cors from 'cors';
import session from 'express-session';
// Importez ici d'autres fonctions pour démarrer d'autres services si nécessaire

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

import { startUsersService } from './services/users/index.js';

startUsersService();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
