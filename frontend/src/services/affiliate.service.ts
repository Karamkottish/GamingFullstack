import { api } from '@/lib/api-client'

// ============================================================================
// TYPES
// ============================================================================

export interface AffiliateStats {
    total_clicks: number
    registrations: number
    ftd_count: number
    total_revenue: string
    pending_payouts: string
    total_withdrawn: string
    conversion_rate: number
}

export interface PerformancePoint {
    date: string
    clicks: number
    conversions: number
    revenue: string
}

export interface FunnelStats {
    total_clicks: number
    total_registrations: number
    total_ftd: number
    click_to_reg_rate: number
    reg_to_ftd_rate: number
    overall_conversion_rate: number
}

export interface CreateLinkRequest {
    target_url: string
    campaign_name: string
}

export interface LinkResponse {
    id: string
    short_link: string
    slug: string
    campaign_name: string
    created_at: string
}

export interface LinkListItem {
    id: string
    slug: string
    target_url: string
    campaign_name: string
    created_at: string
    total_clicks: number
    total_conversions: number
    total_revenue: string
    is_active: boolean
}

export interface LinksList {
    links: LinkListItem[]
    total: number
    page: number
    page_size: number
}

export interface AffiliateWallet {
    available_balance: string
    pending_payouts: string
    total_earned: string
    total_withdrawn: string
    currency: string
}

export interface PayoutRequest {
    amount: string
    method: string
    destination?: string
}

export interface PayoutLog {
    id: string
    amount: string
    method: string
    destination?: string
    status: string
    requested_at: string
    processed_at?: string
    rejection_reason?: string
}

export interface PayoutsList {
    payouts: PayoutLog[]
    total: number
    page: number
    page_size: number
}

// ============================================================================
// API SERVICE
// ============================================================================

export const AffiliateService = {
    // Stats & Analytics
    async getStats(): Promise<AffiliateStats> {
        const response = await api.get<AffiliateStats>('/v1/affiliate/stats')
        return response.data
    },

    async getPerformance(days: number = 7): Promise<PerformancePoint[]> {
        const response = await api.get<PerformancePoint[]>(`/v1/affiliate/analytics/performance?days=${days}`)
        return response.data
    },

    async getFunnelStats(): Promise<FunnelStats> {
        const response = await api.get<FunnelStats>('/v1/affiliate/analytics/funnel')
        return response.data
    },

    // Link Management
    async createLink(data: CreateLinkRequest): Promise<LinkResponse> {
        const response = await api.post<LinkResponse>('/v1/affiliate/links', data)
        return response.data
    },

    async getLinks(page: number = 1, pageSize: number = 20): Promise<LinksList> {
        const response = await api.get<LinksList>(`/v1/affiliate/links?page=${page}&page_size=${pageSize}`)
        return response.data
    },

    async deleteLink(linkId: string): Promise<void> {
        await api.delete(`/v1/affiliate/links/${linkId}`)
    },

    // Wallet & Payouts
    async getWallet(): Promise<AffiliateWallet> {
        const response = await api.get<AffiliateWallet>('/v1/affiliate/wallet')
        return response.data
    },

    async requestPayout(data: PayoutRequest): Promise<PayoutLog> {
        const response = await api.post<PayoutLog>('/v1/affiliate/payouts/request', data)
        return response.data
    },

    async getPayouts(page: number = 1, pageSize: number = 20, status?: string): Promise<PayoutsList> {
        let url = `/v1/affiliate/payouts?page=${page}&page_size=${pageSize}`
        if (status) url += `&status_filter=${status}`
        const response = await api.get<PayoutsList>(url)
        return response.data
    },

    // Admin Simulation (for demo)
    async approvePayout(payoutId: string): Promise<{ status: string; message: string }> {
        const response = await api.post<{ status: string; message: string }>(`/v1/affiliate/testing/approve-payout/${payoutId}`)
        return response.data
    },

    async rejectPayout(payoutId: string, reason: string): Promise<{ status: string; message: string }> {
        const response = await api.post<{ status: string; message: string }>(`/v1/affiliate/testing/reject-payout/${payoutId}?reason=${encodeURIComponent(reason)}`)
        return response.data
    },

    // Wallet Seeder (for testing)
    async seedWallet(amount: number = 5000): Promise<{ status: string; message: string; new_balance: string }> {
        const response = await api.post<{ status: string; message: string; new_balance: string }>(`/v1/affiliate/testing/seed-wallet?amount=${amount}`)
        return response.data
    },

    // Campaign Data Seeder (for testing)
    async seedCampaignData(linkId?: string, days: number = 7): Promise<{
        status: string;
        message: string;
        stats: {
            links_seeded: number;
            days_generated: number;
            clicks_generated: number;
            conversions_generated: number;
            revenue_generated: string;
        }
    }> {
        let url = `/v1/affiliate/testing/seed-campaign-data?days=${days}`
        if (linkId) url += `&link_id=${linkId}`
        const response = await api.post<{
            status: string;
            message: string;
            stats: {
                links_seeded: number;
                days_generated: number;
                clicks_generated: number;
                conversions_generated: number;
                revenue_generated: string;
            }
        }>(url)
        return response.data
    }
}
