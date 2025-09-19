import { oc } from '@orpc/contract'
import { z } from 'zod'
import { 
  BaseResponseSchema, 
  AdvertiserIdSchema, 
  AccessTokenSchema,
  PageInfoSchema,
  TrackingUrlSchema,
  PartnerEnum,
  RetargetingStateEnum,
  PixelCategoryEnum,
  StatusEnum
} from './schemas'

// Advertiser API endpoints
export const advertiserContract = oc.router({
  info: oc.procedure
    .route('GET', '/advertiser/info/')
    .input(z.object({
      advertiser_ids: z.array(z.string()).describe('List of advertiser IDs'),
      fields: z.array(z.string()).optional().describe('Fields to return'),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          advertiser_id: z.string(),
          advertiser_name: z.string(),
          status: StatusEnum,
          create_time: z.number(),
          update_time: z.number(),
          industry: z.string().optional(),
          description: z.string().optional(),
          role: z.string().optional(),
          address: z.string().optional(),
          timezone: z.string().optional(),
          currency: z.string().optional(),
        })).optional()
      }).optional()
    }))
    .summary('Get advertiser information')
    .description('Retrieve detailed information about one or more advertisers'),

  update: oc.procedure
    .route('POST', '/advertiser/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      advertiser_name: z.string().optional(),
      description: z.string().optional(),
      advertiser_budgets: z.array(z.object({
        budget: z.number(),
        currency: z.string(),
      })).optional(),
      qualification_images: z.array(z.object({
        image_id: z.string(),
        image_url: z.string(),
      })).optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update advertiser information')
    .description('Update advertiser details and settings'),
})

// App Management API endpoints
export const appContract = oc.router({
  create: oc.procedure
    .route('POST', '/app/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      download_url: z.string().url().describe('App download URL'),
      tracking_url: TrackingUrlSchema.optional(),
      partner: PartnerEnum.optional(),
      enable_retargeting: RetargetingStateEnum.default('NON_RETARGETING'),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        app_id: z.string()
      }).optional()
    }))
    .summary('Create an app')
    .description('Create a new app for tracking and attribution'),

  info: oc.procedure
    .route('GET', '/app/info/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      app_ids: z.array(z.string()),
      fields: z.array(z.string()).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          app_id: z.string(),
          app_name: z.string(),
          download_url: z.string(),
          app_type: z.string(),
          status: StatusEnum,
          create_time: z.number(),
          update_time: z.number(),
        })).optional()
      }).optional()
    }))
    .summary('Get app information')
    .description('Retrieve information about apps'),

  list: oc.procedure
    .route('GET', '/app/list/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      page: z.number().min(1).default(1),
      page_size: z.number().min(1).max(1000).default(10),
      fields: z.array(z.string()).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          app_id: z.string(),
          app_name: z.string(),
          download_url: z.string(),
          app_type: z.string(),
          status: StatusEnum,
          create_time: z.number(),
          update_time: z.number(),
        })).optional(),
        page_info: PageInfoSchema.optional(),
      }).optional()
    }))
    .summary('List apps')
    .description('Get a paginated list of apps'),

  update: oc.procedure
    .route('POST', '/app/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      app_id: z.string(),
      app_name: z.string().optional(),
      download_url: z.string().url().optional(),
      tracking_url: TrackingUrlSchema.optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update app')
    .description('Update app information'),
})

// Pixel API endpoints
export const pixelContract = oc.router({
  create: oc.procedure
    .route('POST', '/pixel/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      pixel_name: z.string().min(1, 'Pixel name cannot be empty'),
      pixel_category: PixelCategoryEnum.optional(),
      partner_name: z.string().optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        pixel_id: z.string(),
        pixel_code: z.string(),
        pixel_name: z.string(),
        pixel_category: PixelCategoryEnum.optional(),
        partner_name: z.string().optional(),
        advanced_matching_fields: z.array(z.string()).optional(),
      }).optional()
    }))
    .summary('Create a pixel')
    .description('Create a new pixel for tracking website events'),

  list: oc.procedure
    .route('GET', '/pixel/list/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      page: z.number().min(1).default(1),
      page_size: z.number().min(1).max(1000).default(10),
      pixel_ids: z.array(z.string()).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          pixel_id: z.string(),
          pixel_name: z.string(),
          pixel_code: z.string(),
          pixel_category: PixelCategoryEnum,
          status: StatusEnum,
          create_time: z.number(),
          update_time: z.number(),
        })).optional(),
        page_info: PageInfoSchema.optional(),
      }).optional()
    }))
    .summary('List pixels')
    .description('Get a paginated list of pixels'),

  update: oc.procedure
    .route('POST', '/pixel/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      pixel_id: z.string(),
      pixel_name: z.string().optional(),
      advanced_matching_fields: z.array(z.string()).optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update pixel')
    .description('Update pixel settings'),
})

// Main contract combining all API endpoints
export const tiktokApiContract = oc.router({
  advertiser: advertiserContract,
  app: appContract,
  pixel: pixelContract,
})

export type TikTokApiContract = typeof tiktokApiContract