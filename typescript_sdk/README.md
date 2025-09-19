# TikTok Business API SDK (TypeScript)

A modern, type-safe TypeScript SDK for the TikTok Business API, built with ORPC for excellent developer experience.

## Features

- 🚀 **Type-safe**: Full TypeScript support with auto-completion
- 🔒 **Built-in Authentication**: Automatic access token handling
- 🔄 **Auto-retry**: Configurable retry logic for failed requests
- 📊 **Comprehensive Coverage**: Support for all major TikTok Business API endpoints
- 🛡️ **Error Handling**: Detailed error information with request IDs
- 🎯 **Modern**: Built with latest TypeScript and ORPC standards
- 📦 **Tree-shakable**: Only import what you need

## Installation

```bash
npm install @tiktok/business-api-sdk
# or
yarn add @tiktok/business-api-sdk
# or
pnpm add @tiktok/business-api-sdk
```

## Quick Start

```typescript
import { createTikTokBusinessApiClient } from '@tiktok/business-api-sdk'

// Create client with your access token
const client = createTikTokBusinessApiClient({
  accessToken: 'your_access_token_here'
})

// Get advertiser information
const advertiserInfo = await client.advertiser.info({
  advertiser_ids: ['your_advertiser_id']
})

console.log(advertiserInfo.data?.list?.[0])
```

## Configuration

### Basic Configuration

```typescript
const client = createTikTokBusinessApiClient({
  accessToken: 'your_access_token'
})
```

### Advanced Configuration

```typescript
const client = createTikTokBusinessApiClient({
  accessToken: 'your_access_token',
  baseUrl: 'https://business-api.tiktok.com/open_api/v1.3', // Optional: custom base URL
  timeout: 30000, // Optional: request timeout in ms (default: 30s)
  retry: {
    attempts: 3, // Optional: retry attempts (default: 3)
    delay: 1000, // Optional: delay between retries in ms (default: 1s)
  },
  headers: {
    'Custom-Header': 'value' // Optional: custom headers
  }
})
```

## Usage Examples

### Account Management

```typescript
// Get advertiser information
const advertiserInfo = await client.advertiser.info({
  advertiser_ids: ['123456789'],
  fields: ['advertiser_name', 'status', 'currency'] // Optional: specific fields
})

// Update advertiser
await client.advertiser.update({
  advertiser_id: '123456789',
  advertiser_name: 'My Company',
  description: 'Updated description'
})
```

### App Management

```typescript
// Create an app
const newApp = await client.app.create({
  advertiser_id: '123456789',
  download_url: 'https://apps.apple.com/app/id123456789',
  partner: 'AppsFlyer',
  enable_retargeting: 'RETARGETING',
  tracking_url: {
    click_url: 'https://example.com/click',
    impression_url: 'https://example.com/impression'
  }
})

console.log('Created app:', newApp.data?.app_id)

// List apps with pagination
const apps = await client.app.list({
  advertiser_id: '123456789',
  page: 1,
  page_size: 20
})

// Get specific app information
const appInfo = await client.app.info({
  advertiser_id: '123456789',
  app_ids: ['app_id_1', 'app_id_2']
})
```

### Pixel Management

```typescript
// Create a pixel
const newPixel = await client.pixel.create({
  advertiser_id: '123456789',
  pixel_name: 'Website Tracking Pixel',
  pixel_category: 'ONLINE_STORE',
  partner_name: 'Shopify'
})

console.log('Pixel code:', newPixel.data?.pixel_code)

// List pixels
const pixels = await client.pixel.list({
  advertiser_id: '123456789',
  page: 1,
  page_size: 10
})

// Update pixel
await client.pixel.update({
  advertiser_id: '123456789',
  pixel_id: 'pixel_id_here',
  pixel_name: 'Updated Pixel Name',
  advanced_matching_fields: ['email', 'phone_number']
})
```

## Error Handling

The SDK provides detailed error information:

```typescript
import { TikTokBusinessApiError } from '@tiktok/business-api-sdk'

try {
  const result = await client.advertiser.info({
    advertiser_ids: ['invalid_id']
  })
} catch (error) {
  if (error instanceof TikTokBusinessApiError) {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      requestId: error.requestId
    })
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Authentication

### Static Access Token

```typescript
const client = createTikTokBusinessApiClient({
  accessToken: 'your_long_lived_token'
})
```

### Dynamic Token Updates

```typescript
const client = createTikTokBusinessApiClient({
  accessToken: 'initial_token'
})

// Update token when needed (e.g., after refresh)
client.setAccessToken('new_refreshed_token')
```

## TypeScript Support

The SDK is built with TypeScript first and provides comprehensive type definitions:

```typescript
import type { 
  TikTokBusinessApiConfig,
  BaseResponse,
  PageInfo,
  TrackingUrl 
} from '@tiktok/business-api-sdk'

// All API responses are properly typed
const response = await client.advertiser.info({
  advertiser_ids: ['123']
})

// TypeScript knows the exact shape of the response
const advertiserName = response.data?.list?.[0]?.advertiser_name
//    ^? string | undefined
```

## Rate Limiting

The SDK includes built-in retry logic that respects rate limits:

- Automatic retries for temporary failures
- Exponential backoff for rate limit errors  
- Configurable retry attempts and delays
- No retries for authentication errors (4xx codes)

```typescript
const client = createTikTokBusinessApiClient({
  accessToken: 'token',
  retry: {
    attempts: 5, // Retry up to 5 times
    delay: 2000, // Start with 2s delay, then exponential backoff
  }
})
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [TikTok Business API Documentation](https://business-api.tiktok.com/portal/docs)
- [GitHub Issues](https://github.com/rileyseaburg/tiktok-business-api-sdk/issues)
- [API Status Page](https://status.tiktok.com/)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.