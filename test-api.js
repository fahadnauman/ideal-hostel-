const http = require('http');

async function testApi() {
  const payload = {
    roomNumber: "101",
    category: "PLUMBING",
    description: "Test description",
    tenantName: "Test Tenant"
  };

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/maintenance',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response:', data);
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(JSON.stringify(payload));
  req.end();
}

testApi();
