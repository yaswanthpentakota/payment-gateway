import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Transactions = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('merchant');
        if (!stored) {
            navigate('/login');
            return;
        }
        const merchant = JSON.parse(stored);

        const fetchPayments = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/payments', {
                    headers: {
                        'X-Api-Key': merchant.api_key,
                        'X-Api-Secret': merchant.api_secret
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPayments(data);
                }
            } catch (err) {
                console.error('Failed to load transactions', err);
            }
        };
        fetchPayments();
    }, [navigate]);

    const formatDate = (isoString) => {
        // Spec Example: 2024-01-15 10:31:00
        // I'll stick to a simple readable format or try to match exactly if strict.
        // "2024-01-15 10:31:00"
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toISOString().replace('T', ' ').substring(0, 19);
    };

    return (
        <div className="dashboard-container">
            <header>
                <h2>Transactions</h2>
                <nav>
                    <Link to="/dashboard">Home</Link> | <Link to="/dashboard/transactions">Transactions</Link>
                </nav>
            </header>

            <table data-test-id="transactions-table">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p.id} data-test-id="transaction-row" data-payment-id={p.id}>
                            <td data-test-id="payment-id">{p.id}</td>
                            <td data-test-id="order-id">{p.order_id}</td>
                            <td data-test-id="amount">{p.amount}</td>
                            {/* Spec Req: <td data-test-id="amount">50000</td>. So Raw Paise? 
                  Example in spec shows "50000".
                  But in Dashboard Stats: "₹5,00,000".
                  In Transactions Table Example: "50000".
                  So I will display raw value logic to match spec example "50000".
              */}
                            <td data-test-id="method">{p.method}</td>
                            <td data-test-id="status">{p.status}</td>
                            <td data-test-id="created-at">{formatDate(p.created_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
