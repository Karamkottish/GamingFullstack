import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentService, AgentStats, RevenueChartPoint, CommissionRecord, PayoutRequest } from '@/services/agent.service'
import toast from 'react-hot-toast'

// Query Keys
export const dashboardKeys = {
    all: ['agent', 'dashboard'] as const,
    stats: () => [...dashboardKeys.all, 'stats'] as const,
    analytics: (range: string) => [...dashboardKeys.all, 'analytics', range] as const,
}

export const commissionKeys = {
    all: ['agent', 'commission'] as const,
    list: (filters: any) => [...commissionKeys.all, 'list', filters] as const,
}

// Stats Hook
export function useAgentStats() {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: AgentService.getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// Revenue Analytics Hook
export function useRevenueAnalytics(range = '7d') {
    return useQuery({
        queryKey: dashboardKeys.analytics(range),
        queryFn: () => AgentService.getRevenueAnalytics(range),
        staleTime: 1000 * 60 * 15, // 15 minutes
    })
}

// Commissions List Hook
export function useCommissions(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: commissionKeys.list({ page, pageSize }),
        queryFn: () => AgentService.getCommissions(page, pageSize),
        staleTime: 1000 * 60 * 5,
    })
}

// Payout Request Hook
export function useRequestPayout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: PayoutRequest) => AgentService.requestPayout(data),
        onSuccess: () => {
            // Invalidate wallet and stats to show updated balances
            queryClient.invalidateQueries({ queryKey: ['agent', 'wallet'] })
            queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
            toast.success('Payout request submitted successfully!')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to submit payout request')
        }
    })
}
