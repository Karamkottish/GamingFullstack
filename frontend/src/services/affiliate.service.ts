import { api } from '@/lib/api-client'

export interface AffiliateStats {
    total_clicks: number
    registrations: number
    ftd_count: number
    total_revenue: number
}

export interface PerformancePoint {
    name: string
    clicks: number
    conversions: number
}

export interface CreateLinkRequest {
    target_url: string
    campaign_name: string
}

export interface LinkResponse {
    short_link: string
}

export interface PayoutLog {
    id: string
    amount: number
    method: string
    status: string
    date: string
}

export const AffiliateService = {
    getStats: async () => {
        const response = await api.get<AffiliateStats>('/v1/affiliate/stats')
        return response.data
    },

    getPerformance: async () => {
        const response = await api.get<PerformancePoint[]>('/v1/affiliate/analytics/performance')
        return response.data
    },

    createLink: async (data: CreateLinkRequest) => {
        const response = await api.post<LinkResponse>('/v1/affiliate/links', data)
        return response.data
    },

    getPayoutHistory: async () => {
        const response = await api.get<PayoutLog[]>('/v1/affiliate/payouts')
        return response.data
    }
}
