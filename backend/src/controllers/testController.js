import { pool } from '../config/db.js';

export const getTestMerchant = async (req, res) => {
    try {
        const query = 'SELECT * FROM merchants WHERE email = $1';
        // Test merchant email is fixed: test@example.com
        const result = await pool.query(query, ['test@example.com']);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: { code: 'NOT_FOUND_ERROR', description: 'Test merchant not found' }
            });
        }

        const merchant = result.rows[0];

        // Spec requires specific response structure
        res.status(200).json({
            id: merchant.id,
            email: merchant.email,
            api_key: merchant.api_key,
            api_secret: merchant.api_secret,
            seeded: true
        });

    } catch (error) {
        console.error('Error fetching test merchant:', error);
        res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR' } });
    }
};
