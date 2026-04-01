

const API_URL = 'http://localhost:3001/api/auth';
const testUser = {
  email: `testuser_${Date.now()}@example.com`,
  password: 'Password123!',
  fullName: 'Test User'
};

async function testAuth() {
  console.log('Testing Authentication Flow...');
  
  try {
    // 1. Register
    console.log('1. Registering user...');
    const regRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    console.log('Register Success:', regData.success);
    if (!regData.success) throw new Error(JSON.stringify(regData));
    const token = regData.data.session.access_token;

    // 2. Login
    console.log('2. Logging in...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    console.log('Login Success:', loginData.success);
    if (!loginData.success) throw new Error(JSON.stringify(loginData));
    console.log('Token received:', loginData.data.session.access_token.substring(0, 20) + '...');

    // 3. Logout
    console.log('3. Logging out...');
    const logoutRes = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({})
    });
    const logoutData = await logoutRes.json();
    console.log('Logout Message:', logoutData.message);

    console.log('\nAuthentication flow verification COMPLETE');
  } catch (err) {
    console.error('Auth test failed:', err.message);
  }
}

testAuth();
