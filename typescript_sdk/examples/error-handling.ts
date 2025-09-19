import { createTikTokBusinessApiClient, TikTokBusinessApiError } from '../src'

async function errorHandlingExample() {
  const client = createTikTokBusinessApiClient({
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'your_access_token_here',
    timeout: 10000, // 10 second timeout
    retry: {
      attempts: 2, // Only retry twice
      delay: 500   // Start with 500ms delay
    }
  })

  console.log('⚠️ Error Handling Examples')
  console.log('=' .repeat(50))

  // 1. Invalid advertiser ID
  console.log('\n1️⃣ Testing invalid advertiser ID...')
  try {
    await client.advertiser.info({
      advertiser_ids: ['invalid_advertiser_id']
    })
  } catch (error) {
    if (error instanceof TikTokBusinessApiError) {
      console.log('✅ Caught TikTokBusinessApiError:')
      console.log(`   Code: ${error.code}`)
      console.log(`   Message: ${error.message}`)
      console.log(`   Request ID: ${error.requestId}`)
    } else {
      console.log('❌ Unexpected error type:', error)
    }
  }

  // 2. Invalid access token
  console.log('\n2️⃣ Testing invalid access token...')
  const invalidClient = createTikTokBusinessApiClient({
    accessToken: 'invalid_token_here'
  })

  try {
    await invalidClient.advertiser.info({
      advertiser_ids: ['123456789']
    })
  } catch (error) {
    if (error instanceof TikTokBusinessApiError) {
      console.log('✅ Caught authentication error:')
      console.log(`   Code: ${error.code}`)
      console.log(`   Message: ${error.message}`)
    } else {
      console.log('❌ Unexpected error type:', error)
    }
  }

  // 3. Network timeout simulation
  console.log('\n3️⃣ Testing network timeout...')
  const timeoutClient = createTikTokBusinessApiClient({
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'your_access_token_here',
    timeout: 1, // 1ms timeout - will definitely fail
    retry: {
      attempts: 1, // Don't retry
      delay: 0
    }
  })

  try {
    await timeoutClient.advertiser.info({
      advertiser_ids: ['123456789']
    })
  } catch (error) {
    console.log('✅ Caught timeout error:', error.message)
  }

  // 4. Validation errors
  console.log('\n4️⃣ Testing validation errors...')
  try {
    await client.pixel.create({
      advertiser_id: '123456789',
      pixel_name: '', // Empty name should fail validation
      pixel_category: 'ONLINE_STORE'
    })
  } catch (error) {
    if (error instanceof TikTokBusinessApiError) {
      console.log('✅ Caught validation error:')
      console.log(`   Message: ${error.message}`)
    } else {
      console.log('✅ Caught validation error:', error)
    }
  }

  // 5. Proper error handling pattern
  console.log('\n5️⃣ Demonstrating proper error handling pattern...')
  
  async function safeApiCall() {
    try {
      const result = await client.advertiser.info({
        advertiser_ids: [process.env.TIKTOK_ADVERTISER_ID || 'test_id']
      })
      
      return {
        success: true,
        data: result.data,
        error: null
      }
    } catch (error) {
      if (error instanceof TikTokBusinessApiError) {
        return {
          success: false,
          data: null,
          error: {
            type: 'api_error',
            code: error.code,
            message: error.message,
            requestId: error.requestId
          }
        }
      } else {
        return {
          success: false,
          data: null,
          error: {
            type: 'unknown_error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        }
      }
    }
  }

  const result = await safeApiCall()
  if (result.success) {
    console.log('✅ API call succeeded:', result.data)
  } else {
    console.log('❌ API call failed:', result.error)
  }

  console.log('\n🎯 Error handling examples completed!')
}

if (require.main === module) {
  errorHandlingExample()
}