import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '@/services/transaction.service';
import { categoryService } from '@/services/category.service';
import type { Transaction, TransactionSummary } from '@/types/transaction';
import type { Category } from '@/types/category';

export default function DashboardPage() {
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, transactions, cats] = await Promise.all([
                transactionService.getSummary(),
                transactionService.getRecent(),
                categoryService.getAll(),
            ]);
            setSummary(summaryData);
            setRecentTransactions(transactions);
            setCategories(cats);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Income */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-5xl">💰</div>
                                <div className="text-green-100 text-sm font-semibold">Tháng này</div>
                            </div>
                            <div className="text-green-100 text-sm mb-1">Tổng Thu Nhập</div>
                            <div className="text-3xl font-bold">{summary.totalIncome.toLocaleString()} đ</div>
                        </div>
                    </div>

                    {/* Total Expense */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-5xl">💸</div>
                                <div className="text-red-100 text-sm font-semibold">Tháng này</div>
                            </div>
                            <div className="text-red-100 text-sm mb-1">Tổng Chi Tiêu</div>
                            <div className="text-3xl font-bold">{summary.totalExpense.toLocaleString()} đ</div>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} p-6 text-white shadow-xl hover:shadow-2xl transition-shadow`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-5xl">{summary.balance >= 0 ? '📈' : '📉'}</div>
                                <div className={`${summary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-semibold`}>
                                    Số Dư
                                </div>
                            </div>
                            <div className={`${summary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm mb-1`}>
                                {summary.balance >= 0 ? 'Dư' : 'Thiếu'}
                            </div>
                            <div className="text-3xl font-bold">{Math.abs(summary.balance).toLocaleString()} đ</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Giao Dịch Gần Đây</h3>
                        <Link
                            to="/transactions"
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                            Xem tất cả →
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-6xl mb-4">📊</div>
                            <p>Chưa có giao dịch nào</p>
                            <Link
                                to="/manage"
                                className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Thêm giao dịch đầu tiên
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {recentTransactions.map((txn) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                                        {txn.category?.icon || (txn.type === 'INCOME' ? '💰' : '💸')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {txn.note || txn.category?.name || 'Không có mô tả'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(txn.transactionDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'INCOME' ? '+' : '-'}
                                        {txn.amount.toLocaleString()} đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories Quick View */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Danh Mục</h3>
                        <Link
                            to="/categories"
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                            Quản lý →
                        </Link>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-6xl mb-4">📁</div>
                            <p className="text-sm">Chưa có danh mục</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {categories.slice(0, 8).map((cat) => (
                                <div
                                    key={cat.id}
                                    className="p-4 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer"
                                    style={{ borderColor: cat.color || '#E5E7EB' }}
                                >
                                    <div className="text-3xl mb-2 text-center">{cat.icon || '📁'}</div>
                                    <div className="text-xs font-semibold text-gray-900 text-center truncate">
                                        {cat.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">Mẹo Quản Lý Chi Tiêu</h3>
                        <p className="text-blue-100 text-sm">
                            Hãy ghi chép mọi giao dịch hàng ngày để theo dõi chi tiêu hiệu quả.
                            Sử dụng danh mục để phân loại rõ ràng và dễ dàng phân tích sau này.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
