import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AffiliateService, CreateLinkRequest, PayoutRequest } from '@/services/affiliate.service'
import toast from 'react-hot-toast'

// Query Keys
export const affiliateKeys = {
    all: ['affiliate'] as const,
    stats: () => [...affiliateKeys.all, 'stats'] as const,
    performance: (days: number) => [...affiliateKeys.all, 'performance', days] as const,
    funnel: () => [...affiliateKeys.all, 'funnel'] as const,
    links: (page: number, pageSize: number) => [...affiliateKeys.all, 'links', page, pageSize] as const,
    wallet: () => [...affiliateKeys.all, 'wallet'] as const,
    payouts: (page: number, pageSize: number, status?: string) => [...affiliateKeys.all, 'payouts', page, pageSize, status] as const,
}

// ============================================================================
// STATS & ANALYTICS HOOKS
// ============================================================================

export function useAffiliateStats() {
    return useQuery({
        queryKey: affiliateKeys.stats(),
        queryFn: AffiliateService.getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useAffiliatePerformance(days: number = 7) {
    return useQuery({
        queryKey: affiliateKeys.performance(days),
        queryFn: () => AffiliateService.getPerformance(days),
        staleTime: 1000 * 60 * 15, // 15 minutes
    })
}

export function useFunnelStats() {
    return useQuery({
        queryKey: affiliateKeys.funnel(),
        queryFn: AffiliateService.getFunnelStats,
        staleTime: 1000 * 60 * 5,
    })
}

// ============================================================================
// LINK MANAGEMENT HOOKS
// ============================================================================

export function useAffiliateLinks(page: number = 1, pageSize: number = 20) {
    return useQuery({
        queryKey: affiliateKeys.links(page, pageSize),
        queryFn: () => AffiliateService.getLinks(page, pageSize),
        staleTime: 1000 * 60 * 5,
    })
}

export function useCreateLink() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateLinkRequest) => AffiliateService.createLink(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success('Link created successfully!')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to create link')
        }
    })
}

export function useDeleteLink() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (linkId: string) => AffiliateService.deleteLink(linkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success('Link deleted successfully')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to delete link')
        }
    })
}

// ============================================================================
// WALLET & PAYOUT HOOKS
// ============================================================================

export function useAffiliateWallet() {
    return useQuery({
        queryKey: affiliateKeys.wallet(),
        queryFn: AffiliateService.getWallet,
        staleTime: 1000 * 60 * 5,
    })
}

export function useRequestPayout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: PayoutRequest) => AffiliateService.requestPayout(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.wallet() })
            queryClient.invalidateQueries({ queryKey: affiliateKeys.stats() })
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success('Payout request submitted successfully!')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to submit payout request')
        }
    })
}

export function useAffiliatePayouts(page: number = 1, pageSize: number = 20, status?: string) {
    return useQuery({
        queryKey: affiliateKeys.payouts(page, pageSize, status),
        queryFn: () => AffiliateService.getPayouts(page, pageSize, status),
        staleTime: 1000 * 60 * 5,
    })
}

// Admin Simulation Hooks (for demo)
export function useApprovePayout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payoutId: string) => AffiliateService.approvePayout(payoutId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
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
            AffiliateService.rejectPayout(payoutId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success('Payout rejected (Simulated Admin Action)')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to reject payout')
        }
    })
}

// Seed Wallet (Testing)
export function useSeedWallet() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (amount?: number) => AffiliateService.seedWallet(amount),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.wallet() })
            queryClient.invalidateQueries({ queryKey: affiliateKeys.stats() })
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success(data.message)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to seed wallet')
        }
    })
}

// Seed Campaign Data (Testing)
export function useSeedCampaignData() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ linkId, days }: { linkId?: string; days?: number }) =>
            AffiliateService.seedCampaignData(linkId, days),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.all })
            toast.success(`${data.message}\n${data.stats.clicks_generated} clicks, ${data.stats.conversions_generated} conversions, $${data.stats.revenue_generated} revenue`)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.detail || 'Failed to seed campaign data')
        }
    })
}
