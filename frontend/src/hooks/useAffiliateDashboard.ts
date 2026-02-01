import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AffiliateService, CreateLinkRequest } from '@/services/affiliate.service'
import toast from 'react-hot-toast'

export const affiliateKeys = {
    all: ['affiliate'] as const,
    stats: () => [...affiliateKeys.all, 'stats'] as const,
    performance: () => [...affiliateKeys.all, 'performance'] as const,
    links: () => [...affiliateKeys.all, 'links'] as const,
    payouts: () => [...affiliateKeys.all, 'payouts'] as const,
}

export function useAffiliateStats() {
    return useQuery({
        queryKey: affiliateKeys.stats(),
        queryFn: AffiliateService.getStats,
        staleTime: 1000 * 60 * 5,
    })
}

export function useAffiliatePerformance() {
    return useQuery({
        queryKey: affiliateKeys.performance(),
        queryFn: AffiliateService.getPerformance,
        staleTime: 1000 * 60 * 15,
    })
}

export function useCreateLink() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateLinkRequest) => AffiliateService.createLink(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.links() })
            toast.success('Referral link created!')
        },
        onError: () => {
            toast.error('Failed to create referral link')
        }
    })
}

export function useAffiliatePayouts() {
    return useQuery({
        queryKey: affiliateKeys.payouts(),
        queryFn: AffiliateService.getPayoutHistory,
        staleTime: 1000 * 60 * 5,
    })
}
