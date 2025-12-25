import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Expense Tracker
                    </h1>

                    {user && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                {user.picture && (
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full"
                                    />
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {user.name}
                                    </h2>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={logout}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="mt-8 p-6 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">
                            ✅ Authentication Successful
                        </h3>
                        <p className="text-green-700">
                            Google OAuth login is working. JWT token is stored securely.
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            Ready for REST API integration when you need it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
