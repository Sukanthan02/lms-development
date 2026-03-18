const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(chunks) });
        } catch (e) {
          resolve({ status: res.statusCode, body: chunks });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

(async () => {
  console.log('1. Registering new user...');
  const userPayload = {
    fullName: 'Test User Profile',
    email: `testprofile_${Date.now()}@example.com`,
    password: 'password123'
  };
  
  const regRes = await request('POST', '/api/auth/register', userPayload);
  if (regRes.status !== 201) {
    console.error('Registration failed:', regRes.body);
    process.exit(1);
  }
  
  const token = regRes.body.token;
  console.log('✓ Registered. Token obtained.');
  
  console.log('\n2. Updating user profile...');
  const profilePayload = {
    headline: 'Senior Software Engineer',
    biography: 'I love building scalable web applications.',
    language: 'English, Spanish',
    websiteUrl: 'https://example.com',
    facebookUrl: 'https://facebook.com/testusr',
    linkedinUrl: 'https://linkedin.com/in/testusr',
    profileImage: 'profile123.jpg'
  };
  
  const updateRes = await request('PUT', '/api/auth/profile', profilePayload, token);
  console.log(`Status: ${updateRes.status}`);
  console.log('Response:', JSON.stringify(updateRes.body, null, 2));
  
  if (updateRes.status === 200) {
    console.log('✓ Profile updated successfully.\n');
    console.log('3. Fetching profile to verify...');
    const getRes = await request('GET', '/api/auth/profile', null, token);
    console.log(`Status: ${getRes.status}`);
    console.log('Response:', JSON.stringify(getRes.body, null, 2));
    
    if (getRes.body.data.userDetail && getRes.body.data.userDetail.headline === profilePayload.headline) {
       console.log('\n✅ TEST PASSED: Profile was updated and retrieved properly.');
    } else {
       console.log('\n❌ TEST FAILED: Profile data mismatch.');
    }
  }
})();
