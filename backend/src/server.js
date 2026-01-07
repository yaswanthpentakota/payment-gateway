import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/db.js';
import { getHealth } from './controllers/healthController.js';
import routes from './routes/v1.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Main Routes
app.get('/health', getHealth);
app.use('/api/v1', routes);

// Start Server
const startServer = async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
