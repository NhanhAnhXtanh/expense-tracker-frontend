import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface NavItem {
    path: string;
    icon: string;
    label: string;
    badge?: number;
}

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems: NavItem[] = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/transactions', icon: '💸', label: 'Giao Dịch' },
        { path: '/categories', icon: '📁', label: 'Danh Mục' },
        { path: '/analytics', icon: '📈', label: 'Phân Tích' },
        { path: '/settings', icon: '⚙️', label: 'Cài Đặt' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">💰</div>
                            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                MoneyTracker
                            </h1>
                        </div>
                    ) : (
                        <div className="text-2xl mx-auto">💰</div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="font-semibold">{item.label}</span>
                            )}
                            {item.badge && sidebarOpen && (
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200/50">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.email}</p>
                                <button
                                    onClick={logout}
                                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
            >
                {/* Top Bar */}
                <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
                    <div className="h-full px-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Quick Actions */}
                            <Link
                                to="/transactions/new"
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                            >
                                + Thu Nhập
                            </Link>
                            <Link
                                to="/transactions/new"
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                            >
                                - Chi Tiêu
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
