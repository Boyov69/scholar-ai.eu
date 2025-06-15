#!/usr/bin/env node

/**
 * Scholar-AI Health Check Script
 * Validates project health and identifies issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Scholar-AI Health Check\n');

let issues = [];
let warnings = [];
let passed = [];

// Check 1: License file
console.log('📄 Checking LICENSE file...');
if (fs.existsSync(path.join(projectRoot, 'LICENSE'))) {
  passed.push('✅ LICENSE file exists');
} else {
  issues.push('❌ LICENSE file missing');
}

// Check 2: Package.json validation
console.log('📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  if (packageJson.license) {
    passed.push('✅ License specified in package.json');
  } else {
    warnings.push('⚠️ License not specified in package.json');
  }
  
  if (packageJson.scripts && packageJson.scripts.test) {
    passed.push('✅ Test script defined');
  } else {
    warnings.push('⚠️ Test script not defined');
  }
  
  if (packageJson.scripts && packageJson.scripts.lint) {
    passed.push('✅ Lint script defined');
  } else {
    issues.push('❌ Lint script missing');
  }
  
} catch (error) {
  issues.push('❌ Invalid package.json');
}

// Check 3: ESLint configuration
console.log('🔧 Checking ESLint configuration...');
const eslintConfigs = ['eslint.config.js', '.eslintrc.js', '.eslintrc.json', '.eslintrc'];
let eslintConfigFound = false;

for (const config of eslintConfigs) {
  if (fs.existsSync(path.join(projectRoot, config))) {
    passed.push(`✅ ESLint config found: ${config}`);
    eslintConfigFound = true;
    break;
  }
}

if (!eslintConfigFound) {
  issues.push('❌ ESLint configuration missing');
}

// Check 4: Test setup
console.log('🧪 Checking test setup...');
if (fs.existsSync(path.join(projectRoot, 'jest.config.js'))) {
  passed.push('✅ Jest configuration exists');
} else {
  warnings.push('⚠️ Jest configuration missing');
}

if (fs.existsSync(path.join(projectRoot, 'src', 'setupTests.js'))) {
  passed.push('✅ Test setup file exists');
} else {
  warnings.push('⚠️ Test setup file missing');
}

// Check 5: Test files
const testDirs = [
  path.join(projectRoot, 'src', '__tests__'),
  path.join(projectRoot, 'src', 'components', '__tests__'),
  path.join(projectRoot, 'tests')
];

let testFilesFound = false;
for (const dir of testDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(file => 
      file.endsWith('.test.js') || file.endsWith('.test.jsx') || file.endsWith('.spec.js')
    );
    if (files.length > 0) {
      passed.push(`✅ Test files found in ${path.relative(projectRoot, dir)}`);
      testFilesFound = true;
    }
  }
}

if (!testFilesFound) {
  warnings.push('⚠️ No test files found');
}

// Check 6: Environment files
console.log('🌍 Checking environment configuration...');
if (fs.existsSync(path.join(projectRoot, '.env.example'))) {
  passed.push('✅ Environment example file exists');
} else {
  warnings.push('⚠️ .env.example file missing');
}

// Check 7: Documentation
console.log('📚 Checking documentation...');
if (fs.existsSync(path.join(projectRoot, 'README.md'))) {
  passed.push('✅ README.md exists');
} else {
  issues.push('❌ README.md missing');
}

// Check 8: Git configuration
console.log('🔄 Checking Git configuration...');
if (fs.existsSync(path.join(projectRoot, '.gitignore'))) {
  passed.push('✅ .gitignore exists');
} else {
  warnings.push('⚠️ .gitignore missing');
}

// Check 9: Build configuration
console.log('🏗️ Checking build configuration...');
if (fs.existsSync(path.join(projectRoot, 'vite.config.js'))) {
  passed.push('✅ Vite configuration exists');
} else {
  warnings.push('⚠️ Vite configuration missing');
}

// Check 10: Security files
console.log('🔒 Checking security configuration...');
if (fs.existsSync(path.join(projectRoot, '.nvmrc'))) {
  passed.push('✅ Node version specified');
} else {
  warnings.push('⚠️ Node version not specified (.nvmrc)');
}

// Results
console.log('\n' + '='.repeat(50));
console.log('📊 HEALTH CHECK RESULTS');
console.log('='.repeat(50));

if (passed.length > 0) {
  console.log('\n✅ PASSED:');
  passed.forEach(item => console.log(`  ${item}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️ WARNINGS:');
  warnings.forEach(item => console.log(`  ${item}`));
}

if (issues.length > 0) {
  console.log('\n❌ ISSUES:');
  issues.forEach(item => console.log(`  ${item}`));
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📈 SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed.length}`);
console.log(`⚠️ Warnings: ${warnings.length}`);
console.log(`❌ Issues: ${issues.length}`);

const score = Math.round((passed.length / (passed.length + warnings.length + issues.length)) * 100);
console.log(`📊 Health Score: ${score}%`);

if (issues.length === 0) {
  console.log('\n🎉 Project health is good!');
  process.exit(0);
} else {
  console.log('\n🔧 Please address the issues above.');
  process.exit(1);
}
