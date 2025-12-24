import axios from 'axios'
import { oauth2Service } from './oauth2'

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token automatically
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Get OAuth2 token
            const token = await oauth2Service.getToken()
            config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
            console.error('Failed to add authorization token:', error)
            return Promise.reject(error)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.status, error.response.data)

            // Handle specific error codes
            if (error.response.status === 401) {
                // Unauthorized - clear token and retry
                console.error('Unauthorized - Token may be invalid')
                oauth2Service.clearToken()
            } else if (error.response.status === 403) {
                // Forbidden
                console.error('Forbidden - Insufficient permissions')
            } else if (error.response.status === 500) {
                // Server error
                console.error('Server error - Please try again later')
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request)
        } else {
            // Something else happened
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default apiClient
