import { api } from '@/lib/api-client'

// Types for Agent Dashboard
export interface AgentStats {
    total_users: number
    active_users: number
    total_revenue: number
    total_commission: number
    pending_commission: number
    withdrawable_balance: number
    this_month_revenue: number
    this_month_commission: number
}

export interface RevenueChartPoint {
    date: string
    revenue: number
    commission: number
}

export interface WalletBalance {
    commission_balance: number
    pending_commission: number
    total_withdrawn: number
    total_earned: number
    currency: string
}

export interface UserTableItem {
    id: string
    email: string
    full_name: string
    status: 'ACTIVE' | 'BLOCKED'
    joined_at: string
    total_deposited: number
    total_wagered: number
    last_active: string
}

export interface AddUserPayload {
    email: string
    password?: string
    first_name: string
    last_name: string
    telegram_id: string
}

export interface CommissionRecord {
    id: string
    user_id: string
    user_name: string
    amount: number
    revenue_generated: number
    commission_rate: number
    date: string
    status: 'PENDING' | 'PAID'
}

export interface PayoutRequest {
    amount: number
    method: 'BANK' | 'CRYPTO' | 'USDT'
    wallet_address?: string
}

export interface TransactionRecord {
    id: string
    type: string
    amount: number
    balance_after: number
    description: string
    created_at: string
    status: string
}

export interface PayoutRecord {
    id: string
    amount: number
    method: string
    destination?: string
    status: string
    requested_at: string
    processed_at?: string
    rejection_reason?: string
}

export const AgentService = {
    // Stats
    getStats: async () => {
        const response = await api.get<AgentStats>('/v1/agent/stats')
        return response.data
    },

    getRevenueAnalytics: async (range: string = '7d') => {
        const response = await api.get<RevenueChartPoint[]>('/v1/agent/analytics/revenue', { params: { range } })
        return response.data
    },

    getWallet: async () => {
        const response = await api.get<WalletBalance>('/v1/agent/wallet')
        return response.data
    },

    // User Management
    getUsers: async (page = 1, page_size = 20, search = '') => {
        const response = await api.get<{ data: UserTableItem[], total: number, page: number, page_size: number }>('/v1/agent/users', { params: { page, page_size, search } })
        return response.data
    },

    addUser: async (data: AddUserPayload) => {
        const response = await api.post<UserTableItem>('/v1/agent/users', data)
        return response.data
    },

    toggleUserStatus: async (userId: string) => {
        const response = await api.patch<UserTableItem>(`/v1/agent/users/${userId}/status`)
        return response.data
    },

    // Commissions
    getCommissions: async (page = 1, page_size = 20) => {
        const response = await api.get<{ commissions: CommissionRecord[], total: number, total_amount: number }>('/v1/agent/commissions', { params: { page, page_size } })
        return response.data
    },

    requestPayout: async (data: PayoutRequest) => {
        const response = await api.post('/v1/agent/payouts/request', data)
        return response.data
    },

    getTransactions: async (page = 1, page_size = 20, type?: string) => {
        const response = await api.get<{ transactions: TransactionRecord[], total: number, page: number, page_size: number }>('/v1/agent/transactions', { params: { page, page_size, type } })
        return response.data
    },

    getPayoutHistory: async (page = 1, page_size = 20, status?: string) => {
        const response = await api.get<{ payouts: PayoutRecord[], total: number }>('/v1/agent/payouts', { params: { page, page_size, status } })
        return response.data
    },

    exportCommissions: async () => {
        const response = await api.get('/v1/agent/commissions/export', { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([response.data as Blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `commissions_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
    },

    // Admin Simulation (For Demo)
    approvePayout: async (payoutId: string) => {
        const response = await api.post<PayoutRecord>(`/v1/agent/payouts/${payoutId}/approve`)
        return response.data
    },

    rejectPayout: async (payoutId: string, reason: string) => {
        const response = await api.post<PayoutRecord>(`/v1/agent/payouts/${payoutId}/reject`, { reason })
        return response.data
    },

    seedWallet: async (amount: number) => {
        const response = await api.post(`/v1/agent/testing/seed-wallet?amount=${amount}`)
        return response.data
    }
}
