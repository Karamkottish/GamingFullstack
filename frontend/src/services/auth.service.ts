import { api } from '@/lib/api-client';

// Types based on API Response
export interface Wallet {
    id: string;
    balance: string;
    currency: string;
    is_frozen: boolean;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    telegram_id: string;
    phone_number?: string;
    role: 'AGENT' | 'AFFILIATE' | 'USER' | 'ADMIN';
    is_active: boolean;
    created_at: string;
    wallet?: Wallet;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: User;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    first_name: string;
    last_name: string;
    telegram_id: string;
    phone_number?: string;
    password: string;
    role: 'AGENT' | 'AFFILIATE';
    invite_code?: string;
}

export const AuthService = {
    login: async (credentials: LoginPayload) => {
        const response = await api.post<AuthResponse>('/v1/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterPayload) => {
        const response = await api.post<AuthResponse>('/v1/auth/register', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        window.location.href = '/auth/login';
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const response = await api.post('/v1/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword
        });
        return response.data;
    }
};
