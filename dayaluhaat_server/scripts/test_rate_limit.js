const axios = require('axios');

async function testLimit() {
    const url = 'http://localhost:5050/api/auth/login';
    console.log(`Testing Login Rate Limit against ${url}...`);

    for (let i = 1; i <= 6; i++) {
        try {
            await axios.post(url, {
                email: 'hacker@example.com',
                password: 'wrongpassword'
            });
            console.log(`Attempt ${i}: Success (Unexpected)`);
        } catch (error) {
            if (error.response) {
                console.log(`Attempt ${i}: Status ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.log(`Attempt ${i}: Connection Error (Is server running on 5050?)`);
            }
        }
    }
}

testLimit();
