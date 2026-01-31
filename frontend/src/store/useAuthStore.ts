import { create } from 'zustand'

type UserRole = 'AGENT' | 'AFFILIATE' | null

interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (role: UserRole) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: async (role) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        set({
            isLoading: false,
            isAuthenticated: true,
            user: {
                id: '1',
                name: 'Demo User',
                email: 'demo@nexusplay.com',
                role: role
            }
        })
    },
    logout: () => set({ user: null, isAuthenticated: false }),
}))
