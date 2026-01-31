import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AgentService, AddUserPayload, UserTableItem } from '@/services/agent.service'
import toast from 'react-hot-toast'

// Query Keys
export const agentUserKeys = {
    all: ['agent', 'users'] as const,
    list: (filters: any) => [...agentUserKeys.all, 'list', filters] as const,
}

// Fetch Users Hook
export function useAgentUsers(page = 1, pageSize = 20, search = '') {
    return useQuery({
        queryKey: agentUserKeys.list({ page, pageSize, search }),
        queryFn: () => AgentService.getUsers(page, pageSize, search),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// Add User Hook
export function useAddAgentUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: AddUserPayload) => AgentService.addUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentUserKeys.all })
            toast.success('User registered successfully!')
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to register user')
        }
    })
}

// Toggle User Status Hook
export function useToggleUserStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId: string) => AgentService.toggleUserStatus(userId),
        onMutate: async (userId) => {
            // Cancel outgoing refetch
            await queryClient.cancelQueries({ queryKey: agentUserKeys.all })

            // Snapshot the previous state (needs more complex logic if we want to update specific cache entry)
            // For now, simpler: invalidate after mutation
        },
        onSuccess: (updatedUser) => {
            // Invalidate to refresh the list
            queryClient.invalidateQueries({ queryKey: agentUserKeys.all })
            toast.success(`User status updated to ${updatedUser.status}`)
        },
        onError: () => {
            toast.error('Failed to update user status')
        }
    })
}
