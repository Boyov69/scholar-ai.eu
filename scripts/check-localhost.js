#!/usr/bin/env node

/**
 * Scholar AI Localhost Status Checker
 * 
 * This script checks the status of all localhost services and provides
 * a comprehensive health report.
 * 
 * Usage: node scripts/check-localhost.js
 */

const http = require('http');
const { createClient } = require('@supabase/supabase-js');

// Service configurations
const services = {
  frontend: {
    name: 'Frontend (Vite)',
    url: 'http://localhost:5173',
    port: 5173,
    critical: true
  },
  supabase_api: {
    name: 'Supabase API',
    url: 'http://localhost:54321',
    port: 54321,
    critical: true
  },
  supabase_studio: {
    name: 'Supabase Studio',
    url: 'http://localhost:54323',
    port: 54323,
    critical: false
  },
  edge_functions: {
    name: 'Edge Functions',
    url: 'http://localhost:54321/functions/v1',
    port: 54321,
    critical: true
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Check if a port is accessible
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new require('net').Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, 'localhost');
  });
}

// Check HTTP endpoint
function checkEndpoint(url) {
  return new Promise((resolve) => {
    const request = http.get(url, { timeout: 3000 }, (response) => {
      resolve({
        status: response.statusCode,
        accessible: response.statusCode < 500
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve({ accessible: false, error: 'Timeout' });
    });
    
    request.on('error', (error) => {
      resolve({ accessible: false, error: error.message });
    });
  });
}

// Check Supabase database connection
async function checkSupabaseConnection() {
  try {
    const supabase = createClient(
      'http://localhost:54321',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    );
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      return { connected: false, error: error.message };
    }
    
    return { connected: true, data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// Check Edge Functions
async function checkEdgeFunctions() {
  const functions = [
    'stripe-checkout',
    'stripe-portal',
    'stripe-webhook',
    'subscription-status',
    'usage-tracking'
  ];
  
  const results = {};
  
  for (const func of functions) {
    try {
      const result = await checkEndpoint(`http://localhost:54321/functions/v1/${func}`);
      results[func] = result;
    } catch (error) {
      results[func] = { accessible: false, error: error.message };
    }
  }
  
  return results;
}

// Main status check function
async function checkStatus() {
  console.log(colorize('🏠 Scholar AI Localhost Status Check', 'bold'));
  console.log(colorize('=====================================', 'cyan'));
  console.log('');
  
  const results = {
    services: {},
    database: null,
    functions: {},
    overall: true
  };
  
  // Check basic services
  console.log(colorize('🔍 Checking Services...', 'blue'));
  for (const [key, service] of Object.entries(services)) {
    process.stdout.write(`   ${service.name}... `);
    
    const portCheck = await checkPort(service.port);
    const endpointCheck = await checkEndpoint(service.url);
    
    const isHealthy = portCheck && endpointCheck.accessible;
    results.services[key] = {
      ...service,
      port_accessible: portCheck,
      endpoint_accessible: endpointCheck.accessible,
      healthy: isHealthy,
      status: endpointCheck.status,
      error: endpointCheck.error
    };
    
    if (isHealthy) {
      console.log(colorize('✅ Healthy', 'green'));
    } else {
      console.log(colorize('❌ Unhealthy', 'red'));
      if (service.critical) {
        results.overall = false;
      }
    }
  }
  
  console.log('');
  
  // Check database connection
  console.log(colorize('🗄️  Checking Database...', 'blue'));
  process.stdout.write('   Supabase Connection... ');
  
  const dbCheck = await checkSupabaseConnection();
  results.database = dbCheck;
  
  if (dbCheck.connected) {
    console.log(colorize('✅ Connected', 'green'));
  } else {
    console.log(colorize('❌ Failed', 'red'));
    console.log(`      Error: ${dbCheck.error}`);
    results.overall = false;
  }
  
  console.log('');
  
  // Check Edge Functions
  console.log(colorize('⚡ Checking Edge Functions...', 'blue'));
  const functionsCheck = await checkEdgeFunctions();
  results.functions = functionsCheck;
  
  let functionsHealthy = 0;
  const totalFunctions = Object.keys(functionsCheck).length;
  
  for (const [func, result] of Object.entries(functionsCheck)) {
    process.stdout.write(`   ${func}... `);
    
    if (result.accessible) {
      console.log(colorize('✅ Available', 'green'));
      functionsHealthy++;
    } else {
      console.log(colorize('❌ Unavailable', 'red'));
    }
  }
  
  console.log('');
  
  // Summary
  console.log(colorize('📊 Summary', 'bold'));
  console.log(colorize('==========', 'cyan'));
  
  const healthyServices = Object.values(results.services).filter(s => s.healthy).length;
  const totalServices = Object.keys(results.services).length;
  
  console.log(`   Services: ${healthyServices}/${totalServices} healthy`);
  console.log(`   Database: ${dbCheck.connected ? 'Connected' : 'Disconnected'}`);
  console.log(`   Functions: ${functionsHealthy}/${totalFunctions} available`);
  
  console.log('');
  
  if (results.overall) {
    console.log(colorize('🎉 All critical services are healthy!', 'green'));
    console.log(colorize('🚀 Scholar AI localhost is ready for development!', 'green'));
  } else {
    console.log(colorize('⚠️  Some critical services are unhealthy', 'yellow'));
    console.log(colorize('🔧 Please check the issues above', 'yellow'));
  }
  
  console.log('');
  
  // Quick links
  console.log(colorize('🔗 Quick Links', 'bold'));
  console.log(colorize('=============', 'cyan'));
  console.log(`   Frontend:        ${colorize('http://localhost:5173', 'blue')}`);
  console.log(`   Supabase Studio: ${colorize('http://localhost:54323', 'blue')}`);
  console.log(`   API Docs:        ${colorize('http://localhost:54321/rest/v1/', 'blue')}`);
  
  console.log('');
  
  // Troubleshooting tips
  if (!results.overall) {
    console.log(colorize('🛠️  Troubleshooting Tips', 'bold'));
    console.log(colorize('======================', 'cyan'));
    console.log('   1. Run: npm run localhost:fresh');
    console.log('   2. Check: supabase status');
    console.log('   3. Reset: supabase db reset');
    console.log('   4. Restart: supabase stop && supabase start');
    console.log('');
  }
  
  return results;
}

// Run the status check
if (require.main === module) {
  checkStatus().catch(console.error);
}

module.exports = { checkStatus, checkPort, checkEndpoint };
