import { api } from '@/lib/api-client';

// Types based on Screenshots
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    telegram_id: string;
    role: 'AGENT' | 'AFFILIATE' | 'USER' | 'ADMIN';
    is_active: boolean;
    // full_name might be computed or present based on screenshots
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
    password: string;
    role: 'AGENT' | 'AFFILIATE'; // Restricted for frontend registration
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
    }
};
