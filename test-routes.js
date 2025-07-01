// Test script to debug routing issues
const { handler } = require('./index');

// Test different path scenarios
const testCases = [
  {
    name: 'Root path (/)',
    event: {
      httpMethod: 'GET',
      path: '/',
      resource: '/'
    }
  },
  {
    name: 'Root path with trailing slash (//)',
    event: {
      httpMethod: 'GET',
      path: '//',
      resource: '/'
    }
  },
  {
    name: 'Ping endpoint (/ping)',
    event: {
      httpMethod: 'GET',
      path: '/ping',
      resource: '/ping'
    }
  },
  {
    name: 'Health endpoint (/health)',
    event: {
      httpMethod: 'GET',
      path: '/health',
      resource: '/health'
    }
  },
  {
    name: 'Unknown endpoint (/unknown)',
    event: {
      httpMethod: 'GET',
      path: '/unknown',
      resource: '/unknown'
    }
  }
];

async function runTests() {
  console.log('🔍 Testing Lambda routing...\n');
  
  for (const testCase of testCases) {
    console.log(`📋 Test: ${testCase.name}`);
    console.log(`📍 Path: ${testCase.event.path}`);
    console.log(`🔗 Resource: ${testCase.event.resource}`);
    
    try {
      const result = await handler(testCase.event);
      console.log(`✅ Status: ${result.statusCode}`);
      console.log(`📄 Response: ${result.body}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('─'.repeat(50) + '\n');
  }
}

// Run tests
runTests(); 