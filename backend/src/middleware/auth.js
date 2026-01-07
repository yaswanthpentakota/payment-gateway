import { pool } from '../config/db.js';

export const authenticateMerchant = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const apiSecret = req.headers['x-api-secret'];

    if (!apiKey || !apiSecret) {
        return res.status(401).json({
            error: {
                code: 'AUTHENTICATION_ERROR',
                description: 'Invalid API credentials'
            }
        });
    }

    try {
        const query = 'SELECT * FROM merchants WHERE api_key = $1 AND api_secret = $2 AND is_active = TRUE';
        const result = await pool.query(query, [apiKey, apiSecret]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_ERROR',
                    description: 'Invalid API credentials'
                }
            });
        }

        req.merchant = result.rows[0];
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                description: 'Authentication failed'
            }
        });
    }
};
