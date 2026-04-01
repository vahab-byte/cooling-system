async function testAPIs() {
  const API_URL = 'http://localhost:3001/api';
  console.log('--- Testing Backend APIs ---');

  try {
    // 1. Pricing API
    console.log('\n[1] GET /api/pricing');
    const pRes = await fetch(`${API_URL}/pricing`);
    const pData = await pRes.json();
    console.log('Success:', pData.success, '| Count:', pData.count);
    console.log('First Item Breakdown:', JSON.stringify(pData.data[0].price_breakdown));

    // 2. Book Service API
    console.log('\n[2] POST /api/book-service');
    const bRes = await fetch(`${API_URL}/book-service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        phone: '9876543210',
        address: '123 Arctic Street, Frosty City',
        service_type: 'repair',
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferred_time: '10:00 AM',
        notes: 'AC is making a loud noise'
      })
    });
    const bData = await bRes.json();
    console.log('Success:', bData.success, '| Booking ID:', bData.bookingId);

    // 3. Contact API
    console.log('\n[3] POST /api/contact');
    const cRes = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '1234567890',
        message: 'I would like to inquire about AMC plans for my office.'
      })
    });
    const cData = await cRes.json();
    console.log('Success:', cData.success, '| Message:', cData.message);

    // 4. Support API
    console.log('\n[4] POST /api/support');
    const sRes = await fetch(`${API_URL}/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue_type: 'Billing',
        message: 'My last payment was deducted twice.'
      })
    });
    const sData = await sRes.json();
    if (!sData.success) {
        console.log('Support API ERROR:', JSON.stringify(sData));
    } else {
        console.log('Success:', sData.success, '| Status:', sData.data.status);
    }

    // 5. Admin Bookings API
    console.log('\n[5] GET /api/admin/all');
    const aRes = await fetch(`${API_URL}/admin/all`);
    const aData = await aRes.json();
    console.log('Success:', aData.success, '| Count:', aData.count);

    console.log('\n--- ALL TESTS COMPLETED ---');
  } catch (error) {
    console.error('Test FAILED:', error.message);
  }
}

testAPIs();
