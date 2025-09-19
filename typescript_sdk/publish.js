#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const packageJsonPath = path.join(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

console.log('🚀 Publishing TikTok Business API TypeScript SDK')
console.log('=' .repeat(60))
console.log(`Current version: ${packageJson.version}`)

// Validate we're in the right directory
if (packageJson.name !== '@rileyseaburg/tiktok-business-api-sdk') {
  console.error('❌ This script must be run from the typescript_sdk directory')
  process.exit(1)
}

// Check if we have a GitHub token
if (!process.env.NODE_AUTH_TOKEN && !process.env.GITHUB_TOKEN && !process.env.NPM_TOKEN) {
  console.error('❌ GitHub token required. Set NODE_AUTH_TOKEN, GITHUB_TOKEN, or NPM_TOKEN environment variable.')
  console.error('   You can create a token at: https://github.com/settings/tokens')
  console.error('   The token needs "write:packages" permission.')
  process.exit(1)
}

try {
  // Clean and build
  console.log('\n🧹 Cleaning previous build...')
  execSync('npm run clean', { stdio: 'inherit' })

  console.log('\n🔨 Building package...')
  execSync('npm run build', { stdio: 'inherit' })

  // Run quality checks
  console.log('\n🔍 Running type checks...')
  execSync('npm run type-check', { stdio: 'inherit' })

  console.log('\n🧹 Running linter...')
  execSync('npm run lint', { stdio: 'inherit' })

  // Run tests
  console.log('\n🧪 Running tests...')
  execSync('npm run test', { stdio: 'inherit' })

  // Ask for version bump
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('\n📦 What type of version bump? (patch/minor/major/skip): ', (answer) => {
    const validAnswers = ['patch', 'minor', 'major', 'skip']
    
    if (!validAnswers.includes(answer.toLowerCase())) {
      console.error('❌ Invalid answer. Please choose: patch, minor, major, or skip')
      rl.close()
      process.exit(1)
    }

    try {
      if (answer.toLowerCase() !== 'skip') {
        console.log(`\n⬆️ Bumping ${answer} version...`)
        execSync(`npm version ${answer.toLowerCase()} --no-git-tag-version`, { stdio: 'inherit' })
        
        // Read the new version
        const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        console.log(`New version: ${newPackageJson.version}`)
      }

      // Publish to GitHub Packages
      console.log('\n📦 Publishing to GitHub Packages...')
      execSync('npm publish', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN || process.env.GITHUB_TOKEN || process.env.NPM_TOKEN
        }
      })

      console.log('\n✅ Package published successfully!')
      console.log('\n📋 Next steps:')
      console.log('1. Install the package:')
      console.log('   npm install @rileyseaburg/tiktok-business-api-sdk')
      console.log('')
      console.log('2. Create a GitHub release:')
      console.log('   https://github.com/rileyseaburg/tiktok-business-api-sdk/releases/new')
      console.log('')
      console.log('3. Update documentation if needed')

    } catch (error) {
      console.error('\n❌ Publishing failed:', error.message)
      process.exit(1)
    } finally {
      rl.close()
    }
  })

} catch (error) {
  console.error('\n❌ Pre-publish checks failed:', error.message)
  process.exit(1)
}