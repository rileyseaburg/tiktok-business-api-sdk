// Export the main client and utilities
export { 
  TikTokBusinessApiClient, 
  createTikTokBusinessApiClient,
  TikTokBusinessApiError 
} from './client'

// Export the contract for advanced usage
export { tiktokApiContract } from './contract'

// Export all schemas and types
export * from './schemas'

// Export types
export type { 
  TikTokBusinessApiConfig, 
  RequestOptions,
  TikTokApiContract 
} from './client'