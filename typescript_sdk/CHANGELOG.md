# Changelog

All notable changes to the TikTok Business API SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-09-19

### Added
- 🎉 Complete rewrite using ORPC for type-safe API interactions
- 🚀 Full TypeScript support with comprehensive type definitions
- 🔒 Built-in authentication handling with access token management
- 🔄 Automatic retry logic with exponential backoff
- 📊 Support for all major TikTok Business API endpoints:
  - Account Management (Advertiser info/update)
  - App Management (Create, list, update apps)
  - Pixel Management (Create, list, update pixels)
  - Campaign Management (Create, get, update campaigns)
  - Ad Group Management (Create, get, update ad groups)
  - Ad Management (Create, get, update ads)
  - Business Center Management
  - Reporting (Async report generation)
- 🛡️ Comprehensive error handling with detailed error information
- 📦 Tree-shakable exports for optimal bundle size
- 🎯 Modern fetch-based HTTP client with timeout support
- 📖 Extensive documentation and examples
- 🔧 Development tools (ESLint, TypeScript, Tsup)

### Changed
- 💥 **BREAKING**: Complete API redesign for better developer experience
- 💥 **BREAKING**: Migrated from superagent to native fetch
- 💥 **BREAKING**: New import paths and class structure
- ⚡ Improved performance with modern JavaScript features
- 🏗️ Better project structure with clear separation of concerns

### Migration Guide

#### From v0.1.7 to v2.0.0

**Old way (v0.1.7):**
```javascript
import { ApiClient, AccountManagementApi } from 'business_api_client'

const apiClient = new ApiClient()
apiClient.authentications['accessToken'].accessToken = 'your_token'
const accountApi = new AccountManagementApi(apiClient)

accountApi.advertiserInfo(['advertiser_id'], (error, data) => {
  // Callback-based API
})
```

**New way (v2.0.0):**
```typescript
import { createTikTokBusinessApiClient } from '@tiktok/business-api-sdk'

const client = createTikTokBusinessApiClient({
  accessToken: 'your_token'
})

// Promise-based with full type safety
const result = await client.advertiser.info({
  advertiser_ids: ['advertiser_id']
})
```

### Removed
- 🗑️ Callback-based API (replaced with async/await)
- 🗑️ jQuery and browser-specific code
- 🗑️ Superagent dependency
- 🗑️ CommonJS exports (now ESM-first with CJS compatibility)

## [0.1.7] - Previous Version
- Legacy JavaScript SDK with basic functionality
- Callback-based API
- Auto-generated from OpenAPI specifications
- Limited TypeScript support