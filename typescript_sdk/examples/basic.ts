import { createTikTokBusinessApiClient } from '../src'

async function basicExample() {
  // Initialize the client
  const client = createTikTokBusinessApiClient({
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'your_access_token_here'
  })

  try {
    // Get advertiser information
    console.log('📊 Getting advertiser information...')
    const advertiserInfo = await client.advertiser.info({
      advertiser_ids: [process.env.TIKTOK_ADVERTISER_ID || 'your_advertiser_id']
    })

    const advertiser = advertiserInfo.data?.list?.[0]
    if (advertiser) {
      console.log('✅ Advertiser found:', {
        id: advertiser.advertiser_id,
        name: advertiser.advertiser_name,
        status: advertiser.status,
        currency: advertiser.currency
      })
    } else {
      console.log('❌ No advertiser found')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  basicExample()
}