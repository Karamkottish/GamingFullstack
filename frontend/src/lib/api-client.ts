import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Define the structure of the API Error Response based on screenshots
interface ApiErrorResponse {
    detail?: string | { loc: (string | number)[]; msg: string; type: string }[];
    message?: string;
}

// Create Axios Instance
const apiClient: AxiosInstance = axios.create({
    baseURL: '/api', // Using /api as baseURL to handle proxy through next.config.ts rewrites
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15s timeout
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // In a real app, you might use NextAuth or a custom hook to get this. 
        // For now, we'll assume it's stored in localStorage or handled via cookies.
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
        const { response } = error;

        // GENERIC ERROR HANDLER
        if (!response) {
            // Network Error or Server Down
            toast.error("Network Error", {
                description: "Unable to connect to the server. Please check your internet connection."
            });
            return Promise.reject(error);
        }

        const status = response.status;
        const data = response.data;

        // 401: Unauthorized (Logout user if needed)
        if (status === 401) {
            // Optional: Trigger logout logic here
            // window.location.href = '/auth/login';
            toast.error("Session Expired", { description: "Please login again." });
        }

        // 422: Validation Error (FastAPI style)
        else if (status === 422 && Array.isArray(data.detail)) {
            // Flatten generic Pydantic validation errors
            const messages = data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n');
            toast.error("Validation Error", { description: messages });
        }

        // 400-499: Client Errors
        else if (status >= 400 && status < 500) {
            const message = typeof data.detail === 'string' ? data.detail : (data.message || "Something went wrong");
            toast.error("Request Failed", { description: message });
        }

        // 500+: Server Errors
        else if (status >= 500) {
            toast.error("Server Error", { description: "Our servers are experiencing issues. Please try again later." });
        }

        return Promise.reject(error);
    }
);

// Helper for type-safe requests
export const api = {
    get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }),
    post: <T>(url: string, data?: object) => apiClient.post<T>(url, data),
    put: <T>(url: string, data?: object) => apiClient.put<T>(url, data),
    delete: <T>(url: string) => apiClient.delete<T>(url),
    patch: <T>(url: string, data?: object) => apiClient.patch<T>(url, data),
};
