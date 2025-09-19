#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Bootstrapping TikTok Business API TypeScript SDK')
console.log('=' .repeat(60))

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this script in the typescript_sdk directory.')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
if (packageJson.name !== '@rileyseaburg/tiktok-business-api-sdk') {
  console.error('❌ This doesn\'t appear to be the TikTok Business API SDK directory.')
  process.exit(1)
}

try {
  console.log('\n📦 Installing dependencies...')
  console.log('This will create package-lock.json and node_modules/')
  
  // Remove any existing node_modules and package-lock.json for a clean start
  if (fs.existsSync('node_modules')) {
    console.log('🧹 Removing existing node_modules...')
    execSync('rm -rf node_modules', { stdio: 'inherit' })
  }
  
  if (fs.existsSync('package-lock.json')) {
    console.log('🧹 Removing existing package-lock.json...')
    fs.unlinkSync('package-lock.json')
  }

  // Install dependencies
  console.log('📥 Running npm install...')
  execSync('npm install', { stdio: 'inherit' })

  // Verify installation
  if (fs.existsSync('package-lock.json')) {
    console.log('✅ package-lock.json created successfully!')
  }
  
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules installed successfully!')
  }

  // Run initial build to make sure everything works
  console.log('\n🔨 Running initial build...')
  execSync('npm run build', { stdio: 'inherit' })

  console.log('\n✅ Bootstrap completed successfully!')
  console.log('\n📋 Files created:')
  console.log('  ✓ package-lock.json')
  console.log('  ✓ node_modules/')
  console.log('  ✓ dist/ (built output)')
  
  console.log('\n🚀 Next steps:')
  console.log('1. Commit the package-lock.json file:')
  console.log('   git add package-lock.json')
  console.log('   git commit -m "Add package-lock.json for TypeScript SDK"')
  console.log('')
  console.log('2. Push to trigger CI/CD:')
  console.log('   git push')
  console.log('')
  console.log('3. GitHub Actions should now run successfully!')

} catch (error) {
  console.error('\n❌ Bootstrap failed:', error.message)
  console.error('\n💡 Try:')
  console.error('1. Make sure you have Node.js 18+ installed')
  console.error('2. Make sure you have npm installed')
  console.error('3. Check your internet connection')
  console.error('4. Clear npm cache: npm cache clean --force')
  process.exit(1)
}