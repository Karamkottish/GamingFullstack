import { api } from '@/lib/api-client'

// Types for Agent Dashboard
export interface AgentStats {
    totalUsers: number
    totalRevenue: number
    pendingCommission: number
    withdrawableBalance: number
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
        const response = await api.get<AgentStats>('/agent/stats')
        return response.data
    },

    getRevenueAnalytics: async (range: string = '7d') => {
        const response = await api.get<any[]>('/agent/analytics/revenue', { range })
        return response.data
    },

    // User Management
    getUsers: async (page = 1, limit = 10, search = '') => {
        const response = await api.get<{ data: UserTableItem[], meta: any }>('/agent/users', { page, limit, search })
        return response.data
    },

    addUser: async (data: AddUserPayload) => {
        const response = await api.post('/agent/users', data)
        return response.data
    },

    blockUser: async (userId: string) => {
        const response = await api.post(`/agent/users/${userId}/block`)
        return response.data
    },

    unblockUser: async (userId: string) => {
        const response = await api.post(`/agent/users/${userId}/unblock`)
        return response.data
    },

    // Commissions
    getCommissions: async () => {
        const response = await api.get<any[]>('/agent/commissions')
        return response.data
    },

    requestPayout: async (amount: number, method: string, walletAddress?: string) => {
        const response = await api.post('/agent/payouts/request', { amount, method, walletAddress })
        return response.data
    }
}
