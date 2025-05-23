#!/usr/bin/env node

/**
 * Script to check deployment configuration for 504 errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment configuration for 504 timeout issues...\n');

// Check vercel.json
const vercelPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  console.log('✅ vercel.json found');
  
  if (vercelConfig.functions) {
    console.log('✅ Functions timeout configuration:', JSON.stringify(vercelConfig.functions, null, 2));
  } else {
    console.log('⚠️  No functions timeout configuration found in vercel.json');
  }
  
  if (vercelConfig.regions) {
    console.log('✅ Deployment region:', vercelConfig.regions.join(', '));
  }
  console.log('');
}

// Check API routes for maxDuration
console.log('📁 Checking API routes for timeout configuration...\n');

const apiDir = path.join(process.cwd(), 'app', 'api');
const checkRouteFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.relative(process.cwd(), filePath);
  
  if (content.includes('export const maxDuration')) {
    const match = content.match(/export const maxDuration\s*=\s*(\d+)/);
    if (match) {
      console.log(`✅ ${fileName} - maxDuration: ${match[1]}s`);
    }
  } else {
    console.log(`⚠️  ${fileName} - No maxDuration configured`);
  }
};

const walkDir = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file === 'route.ts' || file === 'route.js') {
      checkRouteFile(filePath);
    }
  });
};

if (fs.existsSync(apiDir)) {
  walkDir(apiDir);
}

console.log('\n📋 Recommendations:');
console.log('1. Ensure your Vercel plan supports the configured timeout duration');
console.log('   - Hobby: 10 seconds max');
console.log('   - Pro: 60 seconds (300s with Fluid Compute)');
console.log('   - Enterprise: Custom limits');
console.log('2. Check that your backend API (Railway) is in a nearby region');
console.log('3. Monitor API response times in production');
console.log('4. Consider implementing streaming responses for long-running operations');
console.log('5. Add proper error handling and retry logic for external API calls'); 