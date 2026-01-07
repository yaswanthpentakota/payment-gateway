import { pool } from '../config/db.js';

export const getHealth = async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        await pool.query('SELECT 1');
        dbStatus = 'connected';
    } catch (error) {
        console.error('Database health check failed:', error);
    }

    const response = {
        status: 'healthy',
        database: dbStatus,
        timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
};
