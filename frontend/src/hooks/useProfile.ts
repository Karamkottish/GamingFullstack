import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService, UpdateProfilePayload } from '@/services/user.service'
import { User } from '@/services/auth.service'
import toast from 'react-hot-toast'

// Query Keys
export const profileKeys = {
    all: ['profile'] as const,
    detail: () => [...profileKeys.all, 'detail'] as const,
}

// Fetch Profile Hook
export function useProfile() {
    return useQuery({
        queryKey: profileKeys.detail(),
        queryFn: UserService.getProfile,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// Update Profile Hook
export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateProfilePayload) => UserService.updateProfile(data),
        onMutate: async (newData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: profileKeys.detail() })

            // Snapshot previous value
            const previousProfile = queryClient.getQueryData<User>(profileKeys.detail())

            // Optimistically update to the new value
            if (previousProfile) {
                queryClient.setQueryData<User>(profileKeys.detail(), {
                    ...previousProfile,
                    ...newData,
                    full_name: `${newData.first_name || previousProfile.first_name} ${newData.last_name || previousProfile.last_name}`,
                })
            }

            return { previousProfile }
        },
        onError: (err, newData, context) => {
            // Rollback on error
            if (context?.previousProfile) {
                queryClient.setQueryData(profileKeys.detail(), context.previousProfile)
            }
            toast.error(err instanceof Error ? err.message : 'Failed to update profile')
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!')
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
        },
    })
}
