#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up TikTok Business API SDK (TypeScript)')
console.log('=' .repeat(60))

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this script in the typescript_sdk directory.')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
if (packageJson.name !== '@tiktok/business-api-sdk') {
  console.error('❌ This doesn\'t appear to be the TikTok Business API SDK directory.')
  process.exit(1)
}

try {
  // Install dependencies
  console.log('\n📦 Installing dependencies...')
  execSync('npm install', { stdio: 'inherit' })

  // Build the project
  console.log('\n🔨 Building the project...')
  execSync('npm run build', { stdio: 'inherit' })

  // Run type checking
  console.log('\n🔍 Running type checks...')
  execSync('npm run type-check', { stdio: 'inherit' })

  // Run linting
  console.log('\n🧹 Running linter...')
  execSync('npm run lint', { stdio: 'inherit' })

  console.log('\n✅ Setup completed successfully!')
  console.log('\n📋 Next steps:')
  console.log('1. Set your environment variables:')
  console.log('   export TIKTOK_ACCESS_TOKEN="your_access_token"')
  console.log('   export TIKTOK_ADVERTISER_ID="your_advertiser_id"')
  console.log('')
  console.log('2. Try running an example:')
  console.log('   npx tsx examples/basic.ts')
  console.log('')
  console.log('3. Start developing!')
  console.log('   npm run dev')

} catch (error) {
  console.error('\n❌ Setup failed:', error.message)
  process.exit(1)
}