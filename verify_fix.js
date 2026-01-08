
import http from 'http';

const BASE_URL = 'http://localhost:8000';

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: () => JSON.parse(data) // mimic fetch API
                    });
                } catch (e) {
                    resolve({ ok: false, status: res.statusCode, json: () => ({}) });
                }
            });
        }).on('error', reject);
    });
}

async function verifyLogin() {
    console.log('1. Checking Backend Health...');
    try {
        const health = await makeRequest(`${BASE_URL}/health`);
        if (health.ok) {
            console.log('   ✅ Backend is UP');
        } else {
            console.error('   ❌ Backend responded but returned error:', health.status);
            return;
        }
    } catch (e) {
        console.error('   ❌ Backend is DOWN. Is it running on port 8000?', e.message);
        return;
    }

    console.log('\n2. Verifying Test Merchant Login (test@example.com)...');
    try {
        const res = await makeRequest(`${BASE_URL}/api/v1/test/merchant`);
        if (res.ok) {
            const data = await res.json(); // It's a sync function in our mock, but await implies promise usually. Logic adjusted below.
            if (data.email === 'test@example.com') {
                console.log('   ✅ Login Verification SUCCESS!');
                console.log('      Merchant found:', data.email);
            } else {
                console.error('   ❌ Unexpected merchant data returned:', data);
            }
        } else {
            let err = {};
            try { err = res.json(); } catch (e) { }
            console.error('   ❌ Test Merchant NOT FOUND or DB Error.');
            console.error('      Response Code:', res.status);
        }
    } catch (e) {
        console.error('   ❌ Error connecting to API:', e.message);
    }
}

verifyLogin();
