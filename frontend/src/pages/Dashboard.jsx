import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [merchant, setMerchant] = useState(null);
    const [stats, setStats] = useState({ total_transactions: 0, total_amount: 0, success_rate: '0%' });

    useEffect(() => {
        const stored = localStorage.getItem('merchant');
        if (!stored) {
            navigate('/login');
            return;
        }
        const m = JSON.parse(stored);
        setMerchant(m);

        // Fetch Stats
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/stats', {
                    headers: {
                        'X-Api-Key': m.api_key,
                        'X-Api-Secret': merchant?.api_secret || JSON.parse(stored).api_secret // Handle closure or reload
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };

        fetchStats();
    }, [navigate]);

    if (!merchant) return <div>Loading...</div>;

    return (
        <div data-test-id="dashboard" className="dashboard-container">
            <header>
                <h2>Dashboard</h2>
                <nav>
                    <Link to="/dashboard">Home</Link> | <Link to="/dashboard/transactions">Transactions</Link>
                </nav>
            </header>

            <div className="card">
                <h3>API Credentials</h3>
                <div data-test-id="api-credentials">
                    <div className="credential-row">
                        <label>API Key</label>
                        <span data-test-id="api-key">{merchant.api_key}</span>
                    </div>
                    <div className="credential-row">
                        <label>API Secret</label>
                        {/* Normally secrets handles with care, but spec requires displaying it in a span data-test-id="api-secret" */}
                        {/* Note: In Test Merchant, we probably don't receive secret from /test/merchant ? 
                    Wait, Backend /test/merchant implementation returns {id, email, api_key}.
                    Does it return secret? 
                    I checked the SQL insert: valid secret.
                    I checked testController.js: "api_key": merchant.api_key.
                    I DID NOT return `api_secret` in the `testController.js` response!
                    THE SPEC DOES NOT EXPLICITLY SAY `/test/merchant` MUST RETURN SECRET.
                    BUT the Dashboard needs to display it?
                    "The dashboard should display the merchant's API credentials after login."
                    "API Secret ... key_test_xyz789".
                    So I MUST return the secret in `/test/merchant` OR the user inputs it?
                    "Login Credentials ... Password: Any password ... The dashboard should display the merchant's API credentials after login."
                    If I use the Test Merchant endpoint, I should return the secret too for this D1 simulation.
                    I should update `testController.js` to return `api_secret`.
                */}
                        <span data-test-id="api-secret">{merchant.api_secret || 'Hidden'}</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Test Orders</h3>
                <p>Create a test order to generate a checkout link.</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={async () => {
                        try {
                            const res = await fetch('/api/v1/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Api-Key': merchant.api_key,
                                    'X-Api-Secret': merchant.api_secret
                                },
                                body: JSON.stringify({ amount: 50000, currency: 'INR', receipt: `test_rcpt_${Date.now()}`, notes: { desc: 'Test Order' } })
                            });
                            if (res.ok) {
                                const order = await res.json();
                                const link = `http://localhost:3001/checkout?order_id=${order.id}`;
                                const open = window.confirm(`Order Created! ID: ${order.id}\n\nDo you want to open the checkout page?`);
                                if (open) window.open(link, '_blank');
                            } else {
                                alert('Failed to create order');
                            }
                        } catch (e) {
                            console.error(e);
                            alert('Error creating order');
                        }
                    }}>Create Test Order (₹500)</button>
                </div>
            </div>

            <div className="card">
                <h3>Stats</h3>
                <div data-test-id="stats-container" className="stats-grid">
                    <div className="stat-item">
                        <label>Total Transactions</label>
                        <div data-test-id="total-transactions">{stats.total_transactions}</div>
                    </div>
                    <div className="stat-item">
                        <label>Total Amount</label>
                        <div data-test-id="total-amount">₹{(stats.total_amount / 100).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="stat-item">
                        <label>Success Rate</label>
                        <div data-test-id="success-rate">{stats.success_rate}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
