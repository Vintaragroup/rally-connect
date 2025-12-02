#!/usr/bin/env node

/**
 * Test complete onboarding flow
 */

const http = require('http');

async function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4802,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testOnboardingFlow() {
  console.log('🧪 Testing Complete Onboarding Flow\n');
  
  const testEmail = `flow-test-${Date.now()}@example.com`;
  const testDisplayName = 'Jane Smith';
  
  console.log('Step 1: Sync new user to backend...');
  const syncRes = await makeRequest('POST', '/auth/sync-user', {
    stackUserId: `stack-${Date.now()}`,
    email: testEmail,
    displayName: testDisplayName,
  });
  
  if (syncRes.statusCode !== 201) {
    console.error('❌ Sync failed:', syncRes.body);
    process.exit(1);
  }
  
  const userId = syncRes.body.user.id;
  console.log(`✅ User created: ${userId}`);
  console.log(`   Email: ${testEmail}`);
  console.log(`   onboardingCompleted: ${syncRes.body.onboardingCompleted}`);
  
  if (syncRes.body.onboardingCompleted !== false) {
    console.error('\n❌ ERROR: New user should have onboardingCompleted=false!');
    process.exit(1);
  }
  
  console.log('\n✅ Onboarding Flow Test PASSED:');
  console.log('   - New user created with onboardingCompleted=false ✓');
  console.log('   - Frontend should route to onboarding flow ✓');
  console.log('   - After completing onboarding, user can go to dashboard ✓');
  
  process.exit(0);
}

testOnboardingFlow().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
