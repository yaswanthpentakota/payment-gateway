import http from 'http';

const orderData = JSON.stringify({
    amount: 50000,  // ₹500.00
    currency: 'INR',
    receipt: 'receipt_' + Date.now()
});

const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'key_test_abc123',
        'X-API-Secret': 'secret_test_xyz789',
        'Content-Length': orderData.length
    }
};

console.log('Creating test order...\n');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
            const order = JSON.parse(data);
            console.log('✅ Order created successfully!\n');
            console.log('Order ID:', order.id);
            console.log('Amount:', order.amount / 100, 'INR');
            console.log('\n🔗 Checkout URL:');
            console.log(`http://localhost:5174/checkout?order_id=${order.id}`);
            console.log('\nCopy the URL above and paste it in your browser!');
        } else {
            console.error('❌ Error creating order:', res.statusCode);
            console.error(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend is running on port 8000');
});

req.write(orderData);
req.end();
