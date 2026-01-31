import { api } from '@/lib/api-client'

// Types for Agent Dashboard
export interface AgentStats {
    totalUsers: number
    totalRevenue: number
    pendingCommission: number
    withdrawableBalance: number
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
    username: string
    email: string
    status: 'ACTIVE' | 'BLOCKED'
    joinedAt: string
    totalDeposited: number
    lastActive: string
}

export interface AddUserPayload {
    username: string
    email: string
    initialCredit: number
}

export const AgentService = {
    // Stats
    getStats: async () => {
        const response = await api.get<AgentStats>('/v1/agent/stats')
        return response.data
    },

    getRevenueAnalytics: async (range: string = '7d') => {
        const response = await api.get<any[]>('/v1/agent/analytics/revenue', { range })
        return response.data
    },

    getWallet: async () => {
        const response = await api.get<WalletBalance>('/v1/agent/wallet')
        return response.data
    },

    // User Management
    getUsers: async (page = 1, limit = 10, search = '') => {
        const response = await api.get<{ data: UserTableItem[], meta: any }>('/v1/agent/users', { page, limit, search })
        return response.data
    },

    addUser: async (data: AddUserPayload) => {
        const response = await api.post('/v1/agent/users', data)
        return response.data
    },

    blockUser: async (userId: string) => {
        const response = await api.post(`/v1/agent/users/${userId}/block`)
        return response.data
    },

    unblockUser: async (userId: string) => {
        const response = await api.post(`/v1/agent/users/${userId}/unblock`)
        return response.data
    },

    // Commissions
    getCommissions: async () => {
        const response = await api.get<any[]>('/v1/agent/commissions')
        return response.data
    },

    requestPayout: async (amount: number, method: string, walletAddress?: string) => {
        const response = await api.post('/v1/agent/payouts/request', { amount, method, walletAddress })
        return response.data
    }
}
