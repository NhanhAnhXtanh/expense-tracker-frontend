import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { userApi, type User } from '@/lib/services'
import { oauth2Service } from '@/lib/oauth2'

function ApiTest() {
    const [token, setToken] = useState<string>('')
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const testToken = async () => {
        try {
            setLoading(true)
            setError('')
            const accessToken = await oauth2Service.getToken()
            setToken(accessToken)
        } catch (err: any) {
            setError(`Failed to get token: ${err.message}`)
            setToken('')
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await userApi.getUsers()
            setUsers(response.data)
        } catch (err: any) {
            setError(`Failed to fetch users: ${err.response?.data?.message || err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">API Connection Test</h1>
                    <p className="text-muted-foreground">
                        Testing OAuth2 + REST API connection
                    </p>
                </div>

                {/* OAuth2 Token Test */}
                <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">1. OAuth2 Token</h2>
                        <Button onClick={testToken} disabled={loading}>
                            {loading ? 'Getting Token...' : 'Get Token'}
                        </Button>
                    </div>
                    {token && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600">✅ Token obtained successfully</p>
                            <pre className="bg-muted p-4 rounded overflow-auto max-h-32 text-xs">
                                {token}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Users Test */}
                <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">2. Fetch Users</h2>
                        <Button onClick={fetchUsers} disabled={loading} variant="secondary">
                            {loading ? 'Loading...' : 'Fetch Users'}
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {users.length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-green-600">
                                ✅ Found {users.length} user(s)
                            </p>
                            <pre className="bg-muted p-4 rounded overflow-auto max-h-96 text-xs">
                                {JSON.stringify(users, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">No users loaded yet</p>
                    )}
                </div>

                {/* Connection Info */}
                <div className="border rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold">Configuration</h3>
                    <div className="text-sm space-y-1 font-mono">
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="text-muted-foreground">API URL:</span>
                            <span>{import.meta.env.VITE_API_URL}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="text-muted-foreground">Base Path:</span>
                            <span>{import.meta.env.VITE_API_BASE_PATH}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="text-muted-foreground">Token URL:</span>
                            <span>{import.meta.env.VITE_OAUTH2_TOKEN_URL}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="text-muted-foreground">Client ID:</span>
                            <span>{import.meta.env.VITE_OAUTH2_CLIENT_ID}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="text-muted-foreground">Endpoint:</span>
                            <span>/rest/entities/User</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-2">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        📝 How to test:
                    </h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Make sure backend is running on port 8081</li>
                        <li>Click "Get Token" to authenticate with OAuth2</li>
                        <li>Click "Fetch Users" to get data from /rest/entities/User</li>
                        <li>Check the response data or error messages</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

export default ApiTest
