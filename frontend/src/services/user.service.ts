import { api } from '@/lib/api-client'
import { User } from './auth.service'

export interface UpdateProfilePayload {
    first_name?: string
    last_name?: string
    telegram_id?: string
    phone?: string
}

export const UserService = {
    getProfile: async () => {
        const response = await api.get<User>('/user/profile')
        return response.data
    },

    updateProfile: async (data: UpdateProfilePayload) => {
        const response = await api.put<User>('/user/profile', data)
        return response.data
    },

    updatePassword: async (oldPass: string, newPass: string) => {
        const response = await api.put('/user/password', { oldPassword: oldPass, newPassword: newPass })
        return response.data
    },

    enable2FA: async () => {
        const response = await api.post<{ qrCodeUrl: string, secret: string }>('/user/2fa/enable')
        return response.data
    }
}
