import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AgentService, WalletBalance } from '@/services/agent.service'
import { User } from '@/services/auth.service'
import { profileKeys } from './useProfile'

// Query Keys
export const walletKeys = {
    all: ['wallet'] as const,
    balance: () => [...walletKeys.all, 'balance'] as const,
}

// Fetch Wallet Balance Hook (AGENT only)
export function useWallet() {
    const queryClient = useQueryClient()
    // Get user from profile query cache
    const user = queryClient.getQueryData<User>(profileKeys.detail())
    const isAgent = user?.role === 'AGENT'

    return useQuery({
        queryKey: walletKeys.balance(),
        queryFn: AgentService.getWallet,
        enabled: isAgent, // Only fetch if user is AGENT
        staleTime: 1000 * 60 * 2, // 2 minutes (wallet data should be fresh)
        retry: 2,
        select: (data) => {
            if (typeof window !== 'undefined') {
                const seed = localStorage.getItem('test_wallet_seed')
                if (seed) {
                    const amount = parseFloat(seed)
                    return {
                        ...data,
                        commission_balance: data.commission_balance + amount,
                        total_earned: data.total_earned + amount
                    }
                }
            }
            return data
        }
    })
}

// Type for wallet data
export type { WalletBalance }
