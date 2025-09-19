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
  StatusEnum,
  ObjectiveTypeEnum,
  BidTypeEnum,
  PlacementTypeEnum,
  DateRangeSchema,
  FilteringSchema
} from './schemas'

// Campaign Management
export const campaignContract = oc.router({
  create: oc.procedure
    .route('POST', '/campaign/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      campaign_name: z.string().min(1, 'Campaign name is required'),
      objective_type: ObjectiveTypeEnum,
      budget: z.number().positive().optional(),
      budget_mode: z.enum(['BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL']).optional(),
      status: StatusEnum.default('ENABLE'),
      campaign_type: z.enum(['NORMAL_CAMPAIGN', 'IOS14_CAMPAIGN']).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        campaign_id: z.string()
      }).optional()
    }))
    .summary('Create a campaign')
    .description('Create a new advertising campaign'),

  get: oc.procedure
    .route('GET', '/campaign/get/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      campaign_ids: z.array(z.string()).optional(),
      filtering: FilteringSchema.optional(),
      fields: z.array(z.string()).optional(),
      page: z.number().min(1).default(1),
      page_size: z.number().min(1).max(1000).default(10),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          campaign_id: z.string(),
          campaign_name: z.string(),
          objective_type: ObjectiveTypeEnum,
          status: StatusEnum,
          budget: z.number().optional(),
          budget_mode: z.string().optional(),
          create_time: z.number(),
          update_time: z.number(),
        })).optional(),
        page_info: PageInfoSchema.optional(),
      }).optional()
    }))
    .summary('Get campaigns')
    .description('Retrieve campaign information'),

  update: oc.procedure
    .route('POST', '/campaign/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      campaign_id: z.string(),
      campaign_name: z.string().optional(),
      budget: z.number().positive().optional(),
      budget_mode: z.enum(['BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL']).optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update campaign')
    .description('Update campaign settings'),

  statusUpdate: oc.procedure
    .route('POST', '/campaign/status/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      campaign_ids: z.array(z.string()),
      status: StatusEnum,
    }))
    .output(BaseResponseSchema)
    .summary('Update campaign status')
    .description('Enable, disable, or delete campaigns'),
})

// Ad Group Management
export const adgroupContract = oc.router({
  create: oc.procedure
    .route('POST', '/adgroup/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      campaign_id: z.string(),
      adgroup_name: z.string().min(1, 'Ad group name is required'),
      placement_type: PlacementTypeEnum,
      bid_type: BidTypeEnum,
      bid_price: z.number().positive().optional(),
      budget: z.number().positive().optional(),
      budget_mode: z.enum(['BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL']).optional(),
      schedule_type: z.enum(['SCHEDULE_START_END', 'SCHEDULE_ONGOING']).optional(),
      schedule_start_time: z.string().optional(),
      schedule_end_time: z.string().optional(),
      status: StatusEnum.default('ENABLE'),
      // Targeting options
      location_ids: z.array(z.string()).optional(),
      age_groups: z.array(z.string()).optional(),
      genders: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      interest_keyword_ids: z.array(z.string()).optional(),
      behavior_target_ids: z.array(z.string()).optional(),
      excluded_audience_ids: z.array(z.string()).optional(),
      included_custom_actions: z.array(z.object({
        action_period: z.number(),
        action_scene: z.string(),
        video_user_actions: z.array(z.string()).optional(),
      })).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        adgroup_id: z.string()
      }).optional()
    }))
    .summary('Create an ad group')
    .description('Create a new ad group within a campaign'),

  get: oc.procedure
    .route('GET', '/adgroup/get/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      adgroup_ids: z.array(z.string()).optional(),
      campaign_ids: z.array(z.string()).optional(),
      filtering: FilteringSchema.optional(),
      fields: z.array(z.string()).optional(),
      page: z.number().min(1).default(1),
      page_size: z.number().min(1).max(1000).default(10),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          adgroup_id: z.string(),
          adgroup_name: z.string(),
          campaign_id: z.string(),
          status: StatusEnum,
          placement_type: PlacementTypeEnum,
          bid_type: BidTypeEnum,
          bid_price: z.number().optional(),
          budget: z.number().optional(),
          create_time: z.number(),
          update_time: z.number(),
        })).optional(),
        page_info: PageInfoSchema.optional(),
      }).optional()
    }))
    .summary('Get ad groups')
    .description('Retrieve ad group information'),

  update: oc.procedure
    .route('POST', '/adgroup/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      adgroup_id: z.string(),
      adgroup_name: z.string().optional(),
      bid_price: z.number().positive().optional(),
      budget: z.number().positive().optional(),
      budget_mode: z.enum(['BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL']).optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update ad group')
    .description('Update ad group settings'),
})

// Ad Management
export const adContract = oc.router({
  create: oc.procedure
    .route('POST', '/ad/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      adgroup_id: z.string(),
      ad_name: z.string().min(1, 'Ad name is required'),
      ad_format: z.enum(['SINGLE_IMAGE', 'SINGLE_VIDEO', 'CAROUSEL', 'SPARK_AD', 'PANGLE_SINGLE_IMAGE', 'PANGLE_SINGLE_VIDEO']),
      creatives: z.array(z.object({
        ad_text: z.string(),
        call_to_action: z.string().optional(),
        landing_page_url: z.string().url().optional(),
        display_name: z.string().optional(),
        image_ids: z.array(z.string()).optional(),
        video_id: z.string().optional(),
        avatar_icon_web_uri: z.string().optional(),
        brand_safety_postbid_partner: z.string().optional(),
        clickability: z.string().optional(),
        disclaimer_text: z.object({
          disclaimer_text: z.string(),
          disclaimer_clickable_texts: z.array(z.object({
            text: z.string(),
            url: z.string().url(),
          })).optional(),
        }).optional(),
      })),
      status: StatusEnum.default('ENABLE'),
      tracking_pixel_id: z.string().optional(),
      is_aco: z.boolean().default(false),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        ad_id: z.string(),
        ad_ids: z.array(z.string()).optional()
      }).optional()
    }))
    .summary('Create an ad')
    .description('Create a new ad with creative content'),

  get: oc.procedure
    .route('GET', '/ad/get/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      ad_ids: z.array(z.string()).optional(),
      adgroup_ids: z.array(z.string()).optional(),
      campaign_ids: z.array(z.string()).optional(),
      filtering: FilteringSchema.optional(),
      fields: z.array(z.string()).optional(),
      page: z.number().min(1).default(1),
      page_size: z.number().min(1).max(1000).default(10),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        list: z.array(z.object({
          ad_id: z.string(),
          ad_name: z.string(),
          adgroup_id: z.string(),
          campaign_id: z.string(),
          status: StatusEnum,
          ad_format: z.string(),
          create_time: z.number(),
          update_time: z.number(),
          modify_time: z.number().optional(),
          impression_tracking_url: z.string().optional(),
          click_tracking_url: z.string().optional(),
        })).optional(),
        page_info: PageInfoSchema.optional(),
      }).optional()
    }))
    .summary('Get ads')
    .description('Retrieve ad information'),

  update: oc.procedure
    .route('POST', '/ad/update/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      ad_id: z.string(),
      ad_name: z.string().optional(),
      creatives: z.array(z.object({
        ad_text: z.string().optional(),
        call_to_action: z.string().optional(),
        landing_page_url: z.string().url().optional(),
        display_name: z.string().optional(),
      })).optional(),
    }))
    .output(BaseResponseSchema)
    .summary('Update ad')
    .description('Update ad creative content'),
})

// Business Center Management
export const businessCenterContract = oc.router({
  create: oc.procedure
    .route('POST', '/bc/create/')
    .input(z.object({
      business_center_name: z.string().min(1, 'Business center name is required'),
      time_zone: z.string(),
      advertiser_info: z.object({
        advertiser_name: z.string(),
        brand: z.string().optional(),
        country: z.string(),
        currency: z.string(),
        industry: z.string(),
        phone_number: z.string().optional(),
        email: z.string().email().optional(),
      }),
      billing_info: z.object({
        address: z.string(),
        tax_id: z.string().optional(),
      }).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        bc_id: z.string(),
        advertiser_id: z.string(),
      }).optional()
    }))
    .summary('Create business center')
    .description('Create a new business center with advertiser'),

  get: oc.procedure
    .route('GET', '/bc/get/')
    .input(z.object({
      bc_id: z.string(),
      fields: z.array(z.string()).optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        bc_id: z.string(),
        bc_name: z.string(),
        time_zone: z.string(),
        status: StatusEnum,
        create_time: z.number(),
        update_time: z.number(),
      }).optional()
    }))
    .summary('Get business center')
    .description('Retrieve business center information'),
})

// Reporting
export const reportContract = oc.router({
  taskCreate: oc.procedure
    .route('POST', '/report/task/create/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      report_type: z.enum([
        'BASIC', 'AUDIENCE', 'PLAYABLE_MATERIAL', 'CATALOG',
        'SHOPPING_ADS', 'LIVE_SHOPPING_ADS', 'DPA', 'REACH_FREQUENCY'
      ]),
      data_level: z.enum(['AUCTION_CAMPAIGN', 'AUCTION_ADGROUP', 'AUCTION_AD', 'ADVERTISER']),
      dimensions: z.array(z.string()),
      metrics: z.array(z.string()),
      service_type: z.enum(['AUCTION', 'RESERVATION']).default('AUCTION'),
      start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
      end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
      timezone: z.string().default('UTC'),
      filtering: FilteringSchema.optional(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        task_id: z.string()
      }).optional()
    }))
    .summary('Create report task')
    .description('Create an asynchronous report generation task'),

  taskCheck: oc.procedure
    .route('GET', '/report/task/check/')
    .input(z.object({
      advertiser_id: AdvertiserIdSchema,
      task_id: z.string(),
    }))
    .output(BaseResponseSchema.extend({
      data: z.object({
        task_id: z.string(),
        status: z.enum(['QUEUING', 'PROCESSING', 'SUCCESS', 'FAILED']),
        download_url: z.string().url().optional(),
      }).optional()
    }))
    .summary('Check report task status')
    .description('Check the status of a report generation task'),
})

// Extended main contract
export const tiktokApiContract = oc.router({
  advertiser: oc.router({
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
  }),

  app: oc.router({
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
  }),

  pixel: oc.router({
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
  }),

  campaign: campaignContract,
  adgroup: adgroupContract,
  ad: adContract,
  businessCenter: businessCenterContract,
  report: reportContract,
})

export type TikTokApiContract = typeof tiktokApiContract