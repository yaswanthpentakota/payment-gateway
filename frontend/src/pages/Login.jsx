import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if test merchant
        if (email === 'test@example.com') {
            try {
                const response = await fetch('http://localhost:8000/api/v1/test/merchant');
                if (response.ok) {
                    const merchant = await response.json();
                    localStorage.setItem('merchant', JSON.stringify(merchant));
                    navigate('/dashboard');
                } else {
                    alert('Test merchant not found');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed');
            }
        } else {
            // For D1, only test merchant is supported via this auto-fetch mechanism.
            // Or we can simulate login.
            alert('Only test@example.com is supported for this demo');
        }
    };

    return (
        <div className="login-container">
            <h1>Payment Gateway</h1>
            <form onSubmit={handleLogin} data-test-id="login-form">
                <input
                    data-test-id="email-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    data-test-id="password-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" data-test-id="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
