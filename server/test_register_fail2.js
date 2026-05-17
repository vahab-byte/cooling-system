async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sabdulvahab242@gmail.com',
        password: 'somenewpassword2',
        fullName: 'Shaikh Vahab'
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch(e) {
    console.log("Fetch failed:", e);
  }
}
test();
