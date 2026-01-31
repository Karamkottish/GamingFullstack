import { api } from '@/lib/api-client'

export interface AffiliateStats {
    totalClicks: number
    registrations: number
    ftdCount: number
    totalRevenue: number
}

export const AffiliateService = {
    getStats: async () => {
        const response = await api.get<AffiliateStats>('/affiliate/stats')
        return response.data
    },

    getPerformanceAnalytics: async () => {
        const response = await api.get<any[]>('/affiliate/analytics/performance')
        return response.data
    },

    generateLink: async (targetUrl: string, campaignName: string) => {
        const response = await api.post<{ shortLink: string }>('/affiliate/links', { targetUrl, campaignName })
        return response.data
    },

    getMarketingAssets: async () => {
        const response = await api.get<any[]>('/affiliate/marketing/assets')
        return response.data
    },

    getPayouts: async () => {
        const response = await api.get<any[]>('/affiliate/payouts')
        return response.data
    },

    requestPayout: async (payload: { amount: number, method: string, address: string }) => {
        const response = await api.post('/affiliate/payouts/request', payload)
        return response.data
    }
}
