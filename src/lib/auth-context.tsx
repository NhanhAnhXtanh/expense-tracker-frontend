import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
    token: string | null
    user: GoogleUser | null
    login: (credential: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

interface GoogleUser {
    sub: string
    email: string
    name: string
    picture?: string
    given_name?: string
    family_name?: string
    exp?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<GoogleUser | null>(null)

    useEffect(() => {
        const savedToken = sessionStorage.getItem('google_token')
        if (savedToken) {
            try {
                const decoded = jwtDecode<GoogleUser>(savedToken)
                if (decoded.exp && decoded.exp * 1000 > Date.now()) {
                    setToken(savedToken)
                    setUser(decoded)
                } else {
                    sessionStorage.removeItem('google_token')
                }
            } catch (error) {
                console.error('Invalid token:', error)
                sessionStorage.removeItem('google_token')
            }
        }
    }, [])

    const login = async (credential: string) => {
        try {
            const decoded = jwtDecode<GoogleUser>(credential)
            setToken(credential)
            setUser(decoded)
            sessionStorage.setItem('google_token', credential)
            console.log('✅ Logged in as:', decoded.email)

            // Sync user with backend to trigger JwtToUserDetailsConverter
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
                    headers: {
                        'Authorization': `Bearer ${credential}`
                    }
                })
                if (response.ok) {
                    const backendUser = await response.json()
                    console.log('✅ User synced in backend:', backendUser)
                } else {
                    console.warn('⚠️ Failed to sync user:', response.status)
                }
            } catch (apiError) {
                console.error('❌ Backend sync error:', apiError)
            }
        } catch (error) {
            console.error('Failed to decode token:', error)
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        sessionStorage.removeItem('google_token')
        console.log('👋 Logged out')
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
