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

export const transactionKeys = {
    all: ['agent', 'transactions'] as const,
    list: (filters: any) => [...transactionKeys.all, 'list', filters] as const,
}

export const payoutKeys = {
    all: ['agent', 'payouts'] as const,
    history: (filters: any) => [...payoutKeys.all, 'history', filters] as const,
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

// Transaction History Hook
export function useAgentTransactions(page = 1, pageSize = 20, type?: string) {
    return useQuery({
        queryKey: transactionKeys.list({ page, pageSize, type }),
        queryFn: () => AgentService.getTransactions(page, pageSize, type),
        staleTime: 1000 * 60 * 5,
    })
}

// Payout History Hook
export function usePayoutHistory(page = 1, pageSize = 20, status?: string) {
    return useQuery({
        queryKey: payoutKeys.history({ page, pageSize, status }),
        queryFn: () => AgentService.getPayoutHistory(page, pageSize, status),
        staleTime: 1000 * 60 * 5,
    })
}

// Admin Simulation Hooks (For Demo Purposes)
export function useApprovePayout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payoutId: string) => AgentService.approvePayout(payoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: payoutKeys.all })
            queryClient.invalidateQueries({ queryKey: ['wallet'] })
            queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
            toast.success('Payout approved (Simulated Admin Action)')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to approve payout')
        }
    })
}

export function useRejectPayout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ payoutId, reason }: { payoutId: string, reason: string }) =>
            AgentService.rejectPayout(payoutId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: payoutKeys.all })
            queryClient.invalidateQueries({ queryKey: ['agent', 'wallet'] })
            queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
            toast.success('Payout rejected (Simulated Admin Action)')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to reject payout')
        }
    })
}

export function useSeedWallet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (amount: number) => AgentService.seedWallet(amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: payoutKeys.all })
            queryClient.invalidateQueries({ queryKey: ['agent', 'wallet'] })
            queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
            queryClient.invalidateQueries({ queryKey: commissionKeys.all })
            toast.success('Wallet seeded successfully! (Test Mode)')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to seed wallet')
        }
    })
}
