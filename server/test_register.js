async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_new_user@gmail.com',
        password: 'Password123',
        fullName: 'Test User'
      })
    });
    
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch(e) {
    console.log("Fetch failed:", e);
  }
}
test();
