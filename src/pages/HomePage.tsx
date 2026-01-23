import { useAuth } from '@/lib/auth-context'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        💰 Expense Tracker
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
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {user.name}
                                    </h2>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                        <h3 className="font-bold text-green-900 mb-2 text-lg">
                            ✅ Authentication Successful
                        </h3>
                        <p className="text-green-700">
                            Google OAuth login is working. JWT token is stored securely.
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            Backend APIs are ready for integration!
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/dashboard"
                            className="block p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                            <p className="text-blue-100 text-sm">
                                Xem tổng quan chi tiêu, biểu đồ và insights
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-semibold">
                                Mở Dashboard →
                            </div>
                        </Link>

                        <Link
                            to="/test"
                            className="block p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="text-3xl mb-3">🧪</div>
                            <h3 className="text-xl font-bold mb-2">Test APIs</h3>
                            <p className="text-purple-100 text-sm">
                                Test backend APIs & create sample data
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-semibold">
                                Open →
                            </div>
                        </Link>

                        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl shadow-lg opacity-60">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                            <p className="text-gray-600 text-sm">
                                Main dashboard with charts, analytics, and insights
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-semibold">
                                Coming Soon...
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl shadow-lg opacity-60">
                            <div className="text-3xl mb-3">💸</div>
                            <h3 className="text-xl font-bold mb-2">Transactions</h3>
                            <p className="text-gray-600 text-sm">
                                Manage your income & expenses, add new transactions
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-semibold">
                                Coming Soon...
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl shadow-lg opacity-60">
                            <div className="text-3xl mb-3">📁</div>
                            <h3 className="text-xl font-bold mb-2">Categories</h3>
                            <p className="text-gray-600 text-sm">
                                Organize your expenses with custom categories
                            </p>
                            <div className="mt-4 inline-flex items-center text-sm font-semibold">
                                Coming Soon...
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-bold text-blue-900 mb-3">📋 Project Status</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-gray-700">Backend Phase 1 Complete</span>
                                <span className="ml-auto text-gray-500">Category & Transaction APIs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-gray-700">Google OAuth Authentication</span>
                                <span className="ml-auto text-gray-500">Login System</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-600">✅</span>
                                <span className="text-gray-700">API Test Page</span>
                                <span className="ml-auto text-gray-500">Testing Tool</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-600">🔨</span>
                                <span className="text-gray-700">Frontend Dashboard</span>
                                <span className="ml-auto text-gray-500">In Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
