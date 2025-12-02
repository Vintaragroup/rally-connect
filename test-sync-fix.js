#!/usr/bin/env node

/**
 * Test script to verify the sync-user endpoint works correctly
 * This simulates what the frontend does when a new user signs up
 */

const http = require('http');

// Test data
const testEmail = `test-${Date.now()}@example.com`;
const testStackUserId = `supabase-user-${Date.now()}`;
const testDisplayName = 'John Doe';

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
          headers: res.headers,
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

async function testSyncUserEndpoint() {
  console.log('🧪 Testing sync-user endpoint...\n');
  
  console.log('📊 Test Data:');
  console.log(`  Email: ${testEmail}`);
  console.log(`  Supabase ID: ${testStackUserId}`);
  console.log(`  Display Name: ${testDisplayName}\n`);

  try {
    // Step 1: Call sync-user endpoint
    console.log('1️⃣ Calling POST /auth/sync-user...');
    const syncResponse = await makeRequest('POST', '/auth/sync-user', {
      stackUserId: testStackUserId,
      email: testEmail,
      displayName: testDisplayName,
    });

    console.log(`   Status: ${syncResponse.statusCode}`);
    console.log(`   Response:`, JSON.stringify(syncResponse.body, null, 2));

    if (syncResponse.statusCode !== 201 && syncResponse.statusCode !== 200) {
      console.error('\n❌ Sync failed!');
      process.exit(1);
    }

    const syncedUser = syncResponse.body.user;
    const onboardingCompleted = syncResponse.body.onboardingCompleted;

    console.log(`\n   ✅ User synced: ${syncedUser.id}`);
    console.log(`   ✅ Email: ${syncedUser.email}`);
    console.log(`   ✅ First Name: ${syncedUser.firstName}`);
    console.log(`   ✅ Last Name: ${syncedUser.lastName}`);
    console.log(`   ✅ Onboarding Completed: ${onboardingCompleted}`);

    // Step 2: Verify onboarding status is false
    console.log('\n2️⃣ Verifying onboarding status...');
    if (onboardingCompleted === false) {
      console.log('   ✅ Onboarding status is FALSE (correct!)');
    } else {
      console.error('   ❌ ERROR: Onboarding status is not false!');
      process.exit(1);
    }

    // Step 3: Call sync again to verify idempotency
    console.log('\n3️⃣ Testing idempotency (calling sync again)...');
    const syncResponse2 = await makeRequest('POST', '/auth/sync-user', {
      stackUserId: testStackUserId,
      email: testEmail,
      displayName: testDisplayName,
    });

    console.log(`   Status: ${syncResponse2.statusCode}`);
    if (syncResponse2.statusCode !== 201 && syncResponse2.statusCode !== 200) {
      console.error('   ❌ Second sync failed!');
      process.exit(1);
    }

    const syncedUser2 = syncResponse2.body.user;
    console.log(`   ✅ User synced again: ${syncedUser2.id}`);
    
    // Verify it's the same user
    if (syncedUser.id === syncedUser2.id) {
      console.log('   ✅ Same user returned (idempotent)');
    } else {
      console.error('   ❌ ERROR: Different user returned!');
      process.exit(1);
    }

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    process.exit(1);
  }
}

testSyncUserEndpoint();
