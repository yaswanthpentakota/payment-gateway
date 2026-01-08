
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

async function verifyLogin() {
    console.log('1. Checking Backend Health...');
    try {
        const health = await fetch(`${BASE_URL}/health`);
        if (health.ok) {
            console.log('   ✅ Backend is UP');
        } else {
            console.error('   ❌ Backend responded but returned error:', health.status);
            return;
        }
    } catch (e) {
        console.error('   ❌ Backend is DOWN. Please start the server.', e.message);
        return;
    }

    console.log('\n2. Verifying Test Merchant Login (test@example.com)...');
    try {
        const res = await fetch(`${BASE_URL}/api/v1/test/merchant`);
        if (res.ok) {
            const data = await res.json();
            if (data.email === 'test@example.com') {
                console.log('   ✅ Login Verification SUCCESS!');
                console.log('      Merchant found:', data.email);
                console.log('      This confirms the database is seeded correctly.');
            } else {
                console.error('   ❌ Unexpected merchant data returned:', data);
            }
        } else {
            const err = await res.json();
            console.error('   ❌ Test Merchant NOT FOUND in database.');
            console.error('      Response:', err);
        }
    } catch (e) {
        console.error('   ❌ Error connecting to API:', e.message);
    }
}

verifyLogin();
