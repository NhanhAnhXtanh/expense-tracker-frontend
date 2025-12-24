import axios from 'axios'

interface TokenResponse {
    access_token: string
    token_type: string
    expires_in: number
    scope?: string
}

class OAuth2Service {
    private token: string | null = null
    private tokenExpiry: number | null = null

    async getToken(): Promise<string> {
        // Return cached token if still valid
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            console.log('Using cached token')
            return this.token
        }

        // Fetch new token using client credentials
        try {
            const clientId = import.meta.env.VITE_OAUTH2_CLIENT_ID
            const clientSecret = import.meta.env.VITE_OAUTH2_CLIENT_SECRET

            // Encode credentials for Basic Auth
            const credentials = btoa(`${clientId}:${clientSecret}`)

            const params = new URLSearchParams()
            params.append('grant_type', 'client_credentials')

            console.log('Requesting OAuth2 token...')
            console.log('URL:', import.meta.env.VITE_OAUTH2_TOKEN_URL)
            console.log('Client ID:', clientId)

            const response = await axios.post<TokenResponse>(
                import.meta.env.VITE_OAUTH2_TOKEN_URL,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentials}`,
                    },
                }
            )

            this.token = response.data.access_token
            // Set expiry with 60 second buffer
            this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000

            console.log('✅ OAuth2 token obtained successfully')
            console.log('Token expires in:', response.data.expires_in, 'seconds')
            return this.token
        } catch (error: any) {
            console.error('❌ Failed to get OAuth2 token')
            console.error('Status:', error.response?.status)
            console.error('Error:', error.response?.data || error.message)
            throw new Error(`Authentication failed: ${error.response?.data?.error || error.message}`)
        }
    }

    clearToken() {
        this.token = null
        this.tokenExpiry = null
        console.log('Token cleared')
    }
}

export const oauth2Service = new OAuth2Service()
