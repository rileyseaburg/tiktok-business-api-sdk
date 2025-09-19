import { createORPCClient } from '@orpc/client'
import type { TikTokApiContract } from './contract'

export interface TikTokBusinessApiConfig {
  /** Access token for authentication */
  accessToken: string
  /** Base URL for the API (defaults to TikTok Business API) */
  baseUrl?: string
  /** Custom fetch implementation */
  fetch?: typeof fetch
  /** Request timeout in milliseconds */
  timeout?: number
  /** Retry configuration */
  retry?: {
    attempts?: number
    delay?: number
  }
  /** Custom headers to include with every request */
  headers?: Record<string, string>
}

export interface RequestOptions {
  /** Override access token for this request */
  accessToken?: string
  /** Additional headers for this request */
  headers?: Record<string, string>
  /** Request timeout for this specific request */
  timeout?: number
  /** Signal to abort the request */
  signal?: AbortSignal
}

export class TikTokBusinessApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public requestId?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'TikTokBusinessApiError'
  }
}

export class TikTokBusinessApiClient {
  private config: Required<Omit<TikTokBusinessApiConfig, 'accessToken' | 'headers'>> & 
    Pick<TikTokBusinessApiConfig, 'accessToken' | 'headers'>
  
  private client: ReturnType<typeof createORPCClient<TikTokApiContract>>

  constructor(config: TikTokBusinessApiConfig) {
    this.config = {
      baseUrl: 'https://business-api.tiktok.com/open_api/v1.3',
      fetch: globalThis.fetch,
      timeout: 30000,
      retry: { attempts: 3, delay: 1000 },
      ...config,
    }

    this.client = createORPCClient<TikTokApiContract>({
      baseURL: this.config.baseUrl,
      fetch: this.createFetchWithAuth(),
    })
  }

  private createFetchWithAuth() {
    return async (url: string | URL, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers)
      
      // Add authentication
      headers.set('Access-Token', this.config.accessToken)
      headers.set('Content-Type', 'application/json')
      headers.set('User-Agent', 'TikTok-Business-API-SDK/2.0.0')
      
      // Add custom headers
      if (this.config.headers) {
        Object.entries(this.config.headers).forEach(([key, value]) => {
          headers.set(key, value)
        })
      }

      const fetchOptions: RequestInit = {
        ...init,
        headers,
        signal: init?.signal || AbortSignal.timeout(this.config.timeout),
      }

      let lastError: unknown
      for (let attempt = 0; attempt <= this.config.retry.attempts; attempt++) {
        try {
          const response = await this.config.fetch(url, fetchOptions)
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new TikTokBusinessApiError(
              errorData.message || `HTTP ${response.status}: ${response.statusText}`,
              errorData.code || response.status,
              errorData.request_id
            )
          }

          // Parse and validate response
          const data = await response.json()
          if (data.code && data.code !== 0) {
            throw new TikTokBusinessApiError(
              data.message || 'API Error',
              data.code,
              data.request_id
            )
          }

          return new Response(JSON.stringify(data), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          })
        } catch (error) {
          lastError = error
          
          // Don't retry on authentication errors or client errors
          if (error instanceof TikTokBusinessApiError && error.code && error.code >= 400 && error.code < 500) {
            throw error
          }
          
          // Wait before retry (except on last attempt)
          if (attempt < this.config.retry.attempts) {
            await new Promise(resolve => setTimeout(resolve, this.config.retry.delay * (attempt + 1)))
          }
        }
      }

      throw lastError
    }
  }

  /**
   * Update the access token
   */
  setAccessToken(accessToken: string): void {
    this.config.accessToken = accessToken
  }

  /**
   * Get advertiser information
   */
  get advertiser() {
    return this.client.advertiser
  }

  /**
   * App management endpoints
   */
  get app() {
    return this.client.app
  }

  /**
   * Pixel management endpoints  
   */
  get pixel() {
    return this.client.pixel
  }
}

/**
 * Create a new TikTok Business API client instance
 */
export function createTikTokBusinessApiClient(config: TikTokBusinessApiConfig): TikTokBusinessApiClient {
  return new TikTokBusinessApiClient(config)
}

// Re-export types for convenience
export type { TikTokApiContract } from './contract'
export * from './schemas'