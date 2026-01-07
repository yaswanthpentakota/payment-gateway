import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState(null); // 'upi' or 'card'
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null); // 'success' or 'failed'
    const [paymentId, setPaymentId] = useState(null);

    // Form States
    const [vpa, setVpa] = useState('');
    const [cardDetails, setCardDetails] = useState({
        number: '', expiry: '', cvv: '', holder: ''
    });

    const pollInterval = useRef(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }
        // Fetch Order
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/public`);
                if (res.ok) {
                    setOrder(await res.json());
                } else {
                    console.error('Order not found');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = {
            order_id: orderId,
            method: method
        };

        if (method === 'upi') {
            payload.vpa = vpa;
        } else {
            // Parse Expiry MM/YY
            const [mm, yy] = cardDetails.expiry.split('/');
            payload.card = {
                number: cardDetails.number,
                expiry_month: mm,
                expiry_year: yy,
                cvv: cardDetails.cvv,
                holder_name: cardDetails.holder
            };
        }

        try {
            const res = await fetch(`http://localhost:8000/api/v1/payments/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                setPaymentId(data.id);
                // Start Polling
                pollStatus(data.id);
            } else {
                setProcessing(false);
                setResult('failed');
            }
        } catch (e) {
            console.error(e);
            setProcessing(false);
            setResult('failed');
        }
    };

    const pollStatus = (pid) => {
        pollInterval.current = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/payments/${pid}/public`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success' || data.status === 'failed') {
                        clearInterval(pollInterval.current);
                        setResult(data.status);
                        setProcessing(false);
                    }
                }
            } catch (e) {
                // ignore fetch errors during poll
            }
        }, 2000);
    };

    // Cleanup
    useEffect(() => {
        return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found or missing ID</div>;

    return (
        <div data-test-id="checkout-container" className="checkout-container">
            {/* Order Summary */}
            <div data-test-id="order-summary" className="card">
                <h2>Complete Payment</h2>
                <div>
                    <span>Amount: </span>
                    {/* Spec demands matching <span>₹500.00</span>.
              My backend returns raw amount (50000). I should format it. */}
                    <span data-test-id="order-amount">₹{(order.amount / 100).toFixed(2)}</span>
                </div>
                <div>
                    <span>Order ID: </span>
                    <span data-test-id="order-id">{order.id}</span>
                </div>
            </div>

            {/* Selection */}
            <div data-test-id="payment-methods" className="methods" style={{ display: (!processing && !result) ? 'block' : 'none' }}>
                <button
                    data-test-id="method-upi"
                    data-method="upi"
                    onClick={() => setMethod('upi')}
                    className={method === 'upi' ? 'active' : ''}
                >
                    UPI
                </button>
                <button
                    data-test-id="method-card"
                    data-method="card"
                    onClick={() => setMethod('card')}
                    className={method === 'card' ? 'active' : ''}
                >
                    Card
                </button>
            </div>

            {/* Forms */}
            <form data-test-id="upi-form" onSubmit={handlePayment} className="payment-form" style={{ display: (!processing && !result && method === 'upi') ? 'block' : 'none' }}>
                <input
                    data-test-id="vpa-input"
                    placeholder="username@bank"
                    type="text"
                    value={vpa}
                    onChange={e => setVpa(e.target.value)}
                // Remove required if hidden to avoid form validation blocking? 
                // Actually browser validation will block submission if hidden inputs are invalid.
                // Logic: only submit if method matches. required is fine if we manage validation manually or if we only submit the visible form.
                // But handlePayment is on BOTH forms? No, I have separate forms.
                // wait, <form onSubmit={handlePayment}>.
                // If I hide the form, and the user clicks button on the OTHER form, does this interfere? No.
                // But required fields in hidden form might block?
                // "An invalid form control with name='...' is not focusable."
                // I should probably remove `required` attribute if hidden OR just use `noValidate` on form and validate in JS.
                // I'll leave required but maybe it works if I don't submit THIS form.
                />
                <button data-test-id="pay-button" type="submit">
                    Pay ₹{order ? (order.amount / 100).toFixed(0) : 0}
                </button>
            </form>

            <form data-test-id="card-form" onSubmit={handlePayment} className="payment-form" style={{ display: (!processing && !result && method === 'card') ? 'block' : 'none' }}>
                <input
                    data-test-id="card-number-input"
                    placeholder="Card Number" type="text"
                    value={cardDetails.number}
                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                />
                <input
                    data-test-id="expiry-input"
                    placeholder="MM/YY" type="text"
                    value={cardDetails.expiry}
                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
                <input
                    data-test-id="cvv-input"
                    placeholder="CVV" type="text"
                    value={cardDetails.cvv}
                    onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
                <input
                    data-test-id="cardholder-name-input"
                    placeholder="Name on Card" type="text"
                    value={cardDetails.holder}
                    onChange={e => setCardDetails({ ...cardDetails, holder: e.target.value })}
                />
                <button data-test-id="pay-button" type="submit">
                    Pay ₹{order ? (order.amount / 100).toFixed(0) : 0}
                </button>
            </form>

            {/* Processing State */}
            <div data-test-id="processing-state" style={{ textAlign: 'center', display: processing ? 'block' : 'none' }}>
                <div className="spinner"></div>
                <span data-test-id="processing-message">
                    Processing payment...
                </span>
            </div>

            {/* Success State */}
            <div data-test-id="success-state" className="success" style={{ display: result === 'success' ? 'block' : 'none' }}>
                <h2>Payment Successful!</h2>
                <div>
                    <span>Payment ID: </span>
                    <span data-test-id="payment-id">{paymentId}</span>
                </div>
                <span data-test-id="success-message">
                    Your payment has been processed successfully
                </span>
            </div>

            {/* Error State */}
            <div data-test-id="error-state" className="error" style={{ display: result === 'failed' ? 'block' : 'none' }}>
                <h2>Payment Failed</h2>
                <span data-test-id="error-message">
                    Payment could not be processed
                </span>
                <button data-test-id="retry-button" onClick={() => {
                    setResult(null);
                    setProcessing(false);
                }}>Try Again</button>
            </div>
        </div>
    );
};

export default Checkout;
