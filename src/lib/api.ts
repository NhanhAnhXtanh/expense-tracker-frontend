import axios, { type AxiosError } from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,  // ✅ Automatically send cookies with every request
})

// Request interceptor - NO LONGER NEEDED to add Authorization header
// Cookies are sent automatically by browser
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any

        // If 401 and haven't retried yet, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Call refresh endpoint (cookie will be sent automatically)
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                // Retry original request
                return api.request(originalRequest)
            } catch (refreshError) {
                // Refresh failed, redirect to login
                console.error('Token refresh failed, redirecting to login')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        // Log error details
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data)
        } else {
            console.error('Network Error:', error.message)
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Forbidden - Insufficient permissions')
        }

        return Promise.reject(error)
    }
)

export default api
