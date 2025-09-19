import { z } from 'zod'

// Base response schema that all TikTok API responses follow
export const BaseResponseSchema = z.object({
  code: z.number().optional().describe('Response code'),
  message: z.string().optional().describe('Response message'),
  request_id: z.string().optional().describe('Unique request identifier'),
  data: z.unknown().optional().describe('Response data'),
})

export type BaseResponse<T = unknown> = {
  code?: number
  message?: string
  request_id?: string
  data?: T
}

// Common parameter schemas
export const AdvertiserIdSchema = z.string().describe('Advertiser ID')
export const AccessTokenSchema = z.string().describe('Access Token for authentication')

// Pagination schemas
export const PageInfoSchema = z.object({
  page: z.number().min(1).default(1).describe('Page number'),
  page_size: z.number().min(1).max(1000).default(10).describe('Page size'),
  total_number: z.number().optional().describe('Total number of items'),
  total_page: z.number().optional().describe('Total number of pages'),
})

export const DateRangeSchema = z.object({
  since: z.string().describe('Start date (YYYY-MM-DD)'),
  until: z.string().describe('End date (YYYY-MM-DD)'),
})

// Filtering schemas
export const FilteringSchema = z.object({
  advertiser_ids: z.array(z.string()).optional(),
  campaign_ids: z.array(z.string()).optional(),
  adgroup_ids: z.array(z.string()).optional(),
  ad_ids: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
})

// Enum schemas
export const StatusEnum = z.enum(['ENABLE', 'DISABLE', 'DELETE']).describe('Status')
export const ObjectiveTypeEnum = z.enum([
  'TRAFFIC',
  'CONVERSIONS', 
  'APP_INSTALL',
  'REACH',
  'VIDEO_VIEWS',
  'LEAD_GENERATION',
  'CATALOG_SALES',
  'ENGAGEMENT'
]).describe('Campaign objective type')

export const BidTypeEnum = z.enum([
  'BID_TYPE_NO_BID',
  'BID_TYPE_COST_CAP',
  'BID_TYPE_BID_CAP',
  'BID_TYPE_LOWEST_COST'
]).describe('Bid strategy type')

export const PlacementTypeEnum = z.enum([
  'PLACEMENT_TYPE_AUTOMATIC',
  'PLACEMENT_TYPE_TIKTOK',
  'PLACEMENT_TYPE_TIKTOK_PULSE',
  'PLACEMENT_TYPE_PANGLE'
]).describe('Ad placement type')

// App related schemas
export const PartnerEnum = z.enum([
  'AppsFlyer',
  'Adjust', 
  'TlnkIo',
  'Kochava',
  'AppAdforce',
  'Singular',
  'Adzcore',
  'Tenjin',
  'Other',
  'DoubleClick',
  'ServingsSys',
  'FlashTalking',
  'AppLink',
  'AdBrix',
  'Huangbaoche',
  'Lazada',
  'LeadBolt',
  'Metaps',
  'Vidoadsplus',
  'AppMetrica',
  'Dentsu',
  'myTracker',
  'Adform',
  'doubleverify',
  'Nielsen',
  'Placed_powered_by_Foursquare',
  'Macromil',
  'Testee',
  'Weborama',
  'Kantar',
  'Cinarra',
  'TikTokLeadAd',
  'Shopify',
  'Square',
  'BigCommerce',
  'ECWID',
  'PrestaShop',
  'WooCommerce',
  'Magento',
  'TikTokCustomInstantPage',
  'TikTokEC1PSeller',
  'TikTokEC3PStore',
  'Salesforce',
  'OpenCart',
  'SHOPLINE',
  'Cafe24',
  'BASE'
]).describe('App tracking partner')

export const RetargetingStateEnum = z.enum(['RETARGETING', 'NON_RETARGETING']).describe('Retargeting state')

export const PixelCategoryEnum = z.enum([
  'ONLINE_STORE',
  'FILLING_FORM', 
  'CONTACTS',
  'LANDING_PAGE',
  'CUSTOMIZE_EVENTS'
]).describe('Pixel category')

// Tracking URL schema
export const TrackingUrlSchema = z.object({
  click_url: z.string().url().optional().describe('Click tracking URL'),
  impression_url: z.string().url().optional().describe('Impression tracking URL'),
  retargeting_click_url: z.string().url().optional().describe('Retargeting click URL'),
  retargeting_impression_url: z.string().url().optional().describe('Retargeting impression URL'),
})

export type TrackingUrl = z.infer<typeof TrackingUrlSchema>
export type PageInfo = z.infer<typeof PageInfoSchema>
export type DateRange = z.infer<typeof DateRangeSchema>
export type Filtering = z.infer<typeof FilteringSchema>