import express from 'express';
import { createOrder, getOrder, getPublicOrder } from '../controllers/orderController.js';
import { createPayment, getPayment, listPayments, createPublicPayment, getPublicPayment } from '../controllers/paymentController.js';
import { getTestMerchant } from '../controllers/testController.js';
import { getStats } from '../controllers/statsController.js';
import { authenticateMerchant } from '../middleware/auth.js';

const router = express.Router();

// Order Routes
router.post('/orders', authenticateMerchant, createOrder);
router.get('/orders/:orderId', authenticateMerchant, getOrder);

// Public Routes (for Checkout)
router.get('/orders/:orderId/public', getPublicOrder);
router.post('/payments/public', createPublicPayment);
router.get('/payments/:paymentId/public', getPublicPayment);

// Payment Routes
router.post('/payments', authenticateMerchant, createPayment);
router.get('/payments', authenticateMerchant, listPayments);
router.get('/payments/:paymentId', authenticateMerchant, getPayment);

// Test Routes
router.get('/test/merchant', getTestMerchant);
router.get('/stats', authenticateMerchant, getStats);

export default router;
