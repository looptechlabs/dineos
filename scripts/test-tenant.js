#!/usr/bin/env node

// ============================================================================
// DineOS - Diagnostic Script
// ============================================================================
// Run this to test if your tenant exists and the API is reachable
// Usage: node scripts/test-tenant.js looptech
// ============================================================================

const https = require('https');
const http = require('http');

const tenantSlug = process.argv[2] || 'looptech';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://52.63.95.168:8080/api';

console.log('🔍 DineOS Tenant Diagnostic Tool\n');
console.log(`Testing tenant: ${tenantSlug}`);
console.log(`API Base URL: ${apiUrl}\n`);

// Test 1: Check if tenant exists
const existsUrl = `${apiUrl}/tenants/exists?slug=${tenantSlug}`;
console.log(`📡 Test 1: Checking tenant existence...`);
console.log(`   URL: ${existsUrl}`);

const protocol = existsUrl.startsWith('https') ? https : http;

protocol.get(existsUrl, {
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantSlug,
  }
}, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   ✅ Tenant exists!');
      console.log(`   Response: ${data}\n`);
      
      console.log('🌐 You can now access:\n');
      console.log(`   Admin Login:    http://${tenantSlug}.dineos.localhost:3000/admin/login`);
      console.log(`   Customer Menu:  http://${tenantSlug}.dineos.localhost:3000/`);
      console.log(`   Dashboard:      http://${tenantSlug}.dineos.localhost:3000/admin/dashboard\n`);
      
      console.log('💡 Next steps:');
      console.log('   1. Make sure dev server is running: npm run dev');
      console.log('   2. Open the admin login URL in your browser');
      console.log('   3. Check server console for [fetchTenantBySlug] logs\n');
    } else {
      console.log(`   ❌ Tenant not found or error`);
      console.log(`   Response: ${data}\n`);
      console.log('💡 Troubleshooting:');
      console.log(`   - Verify tenant "${tenantSlug}" exists in your backend`);
      console.log(`   - Check if API URL is correct: ${apiUrl}`);
      console.log(`   - Try creating the tenant from superadmin panel\n`);
    }
  });
}).on('error', (err) => {
  console.log('   ❌ Network error!');
  console.error(`   Error: ${err.message}\n`);
  console.log('💡 Troubleshooting:');
  console.log('   - Check if backend server is running');
  console.log('   - Verify API URL in .env.local');
  console.log('   - Check firewall/network settings\n');
});
