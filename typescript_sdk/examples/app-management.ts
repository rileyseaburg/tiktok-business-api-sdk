import { createTikTokBusinessApiClient } from '../src'

async function appManagementExample() {
  const client = createTikTokBusinessApiClient({
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'your_access_token_here'
  })

  const advertiserId = process.env.TIKTOK_ADVERTISER_ID || 'your_advertiser_id'

  try {
    console.log('📱 App Management Example')
    console.log('=' .repeat(50))

    // 1. Create a new app
    console.log('\n1️⃣ Creating a new app...')
    const newApp = await client.app.create({
      advertiser_id: advertiserId,
      download_url: 'https://apps.apple.com/app/example-app/id123456789',
      partner: 'AppsFlyer',
      enable_retargeting: 'RETARGETING',
      tracking_url: {
        click_url: 'https://example.com/click?app_id={app_id}',
        impression_url: 'https://example.com/impression?app_id={app_id}',
        retargeting_click_url: 'https://example.com/retargeting_click?app_id={app_id}',
        retargeting_impression_url: 'https://example.com/retargeting_impression?app_id={app_id}'
      }
    })

    console.log('✅ App created successfully!')
    console.log('App ID:', newApp.data?.app_id)

    // 2. List all apps
    console.log('\n2️⃣ Listing all apps...')
    const appsList = await client.app.list({
      advertiser_id: advertiserId,
      page: 1,
      page_size: 10
    })

    if (appsList.data?.list && appsList.data.list.length > 0) {
      console.log(`✅ Found ${appsList.data.list.length} apps:`)
      appsList.data.list.forEach((app, index) => {
        console.log(`  ${index + 1}. ${app.app_name} (ID: ${app.app_id})`)
        console.log(`     Status: ${app.status}`)
        console.log(`     Download URL: ${app.download_url}`)
        console.log(`     Created: ${new Date(app.create_time * 1000).toLocaleDateString()}`)
      })

      // 3. Get detailed info for the first app
      const firstApp = appsList.data.list[0]
      if (firstApp) {
        console.log(`\n3️⃣ Getting detailed info for app: ${firstApp.app_name}`)
        const appInfo = await client.app.info({
          advertiser_id: advertiserId,
          app_ids: [firstApp.app_id]
        })

        const detailedApp = appInfo.data?.list?.[0]
        if (detailedApp) {
          console.log('✅ App details:', {
            id: detailedApp.app_id,
            name: detailedApp.app_name,
            type: detailedApp.app_type,
            status: detailedApp.status,
            downloadUrl: detailedApp.download_url
          })
        }

        // 4. Update the app
        console.log('\n4️⃣ Updating app information...')
        await client.app.update({
          advertiser_id: advertiserId,
          app_id: firstApp.app_id,
          app_name: `${firstApp.app_name} (Updated)`,
          tracking_url: {
            click_url: 'https://updated-example.com/click?app_id={app_id}',
            impression_url: 'https://updated-example.com/impression?app_id={app_id}'
          }
        })
        console.log('✅ App updated successfully!')
      }
    } else {
      console.log('ℹ️ No apps found for this advertiser')
    }

  } catch (error) {
    console.error('❌ Error in app management:', error)
  }
}

if (require.main === module) {
  appManagementExample()
}