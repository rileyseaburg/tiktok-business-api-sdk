import { createTikTokBusinessApiClient } from '../src'

async function pixelManagementExample() {
  const client = createTikTokBusinessApiClient({
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'your_access_token_here'
  })

  const advertiserId = process.env.TIKTOK_ADVERTISER_ID || 'your_advertiser_id'

  try {
    console.log('🎯 Pixel Management Example')
    console.log('=' .repeat(50))

    // 1. Create a new pixel
    console.log('\n1️⃣ Creating a new pixel...')
    const newPixel = await client.pixel.create({
      advertiser_id: advertiserId,
      pixel_name: 'E-commerce Tracking Pixel',
      pixel_category: 'ONLINE_STORE',
      partner_name: 'Shopify'
    })

    console.log('✅ Pixel created successfully!')
    console.log('Pixel ID:', newPixel.data?.pixel_id)
    console.log('Pixel Code:')
    console.log(newPixel.data?.pixel_code)

    // 2. List all pixels
    console.log('\n2️⃣ Listing all pixels...')
    const pixelsList = await client.pixel.list({
      advertiser_id: advertiserId,
      page: 1,
      page_size: 10
    })

    if (pixelsList.data?.list && pixelsList.data.list.length > 0) {
      console.log(`✅ Found ${pixelsList.data.list.length} pixels:`)
      pixelsList.data.list.forEach((pixel: any, index: number) => {
        console.log(`  ${index + 1}. ${pixel.pixel_name} (ID: ${pixel.pixel_id})`)
        console.log(`     Category: ${pixel.pixel_category}`)
        console.log(`     Status: ${pixel.status}`)
        console.log(`     Created: ${new Date(pixel.create_time * 1000).toLocaleDateString()}`)
      })

      // 3. Update the first pixel
      const firstPixel = pixelsList.data.list[0]
      if (firstPixel) {
        console.log(`\n3️⃣ Updating pixel: ${firstPixel.pixel_name}`)
        await client.pixel.update({
          advertiser_id: advertiserId,
          pixel_id: firstPixel.pixel_id,
          pixel_name: `${firstPixel.pixel_name} (Updated)`,
          advanced_matching_fields: ['email', 'phone_number', 'first_name', 'last_name']
        })
        console.log('✅ Pixel updated successfully!')
        console.log('Advanced matching fields enabled: email, phone_number, first_name, last_name')
      }
    } else {
      console.log('ℹ️ No pixels found for this advertiser')
    }

    // 4. Create different types of pixels
    console.log('\n4️⃣ Creating different pixel types...')
    
    const pixelTypes = [
      { name: 'Lead Generation Pixel', category: 'FILLING_FORM' as const },
      { name: 'Contact Page Pixel', category: 'CONTACTS' as const },
      { name: 'Landing Page Pixel', category: 'LANDING_PAGE' as const },
      { name: 'Custom Events Pixel', category: 'CUSTOMIZE_EVENTS' as const }
    ]

    for (const pixelType of pixelTypes) {
      try {
        const pixel = await client.pixel.create({
          advertiser_id: advertiserId,
          pixel_name: pixelType.name,
          pixel_category: pixelType.category
        })
        console.log(`✅ Created ${pixelType.name}: ${pixel.data?.pixel_id}`)
      } catch (error) {
        console.log(`⚠️ Failed to create ${pixelType.name}:`, error)
      }
    }

  } catch (error) {
    console.error('❌ Error in pixel management:', error)
  }
}

if (require.main === module) {
  pixelManagementExample()
}