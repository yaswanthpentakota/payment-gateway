import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={<div style={{ padding: 20 }}>Please provide an order_id in the URL. Example: /checkout?order_id=...</div>} />
      </Routes>
    </Router>
  );
}

export default App;
