import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryForm from '@/components/CategoryForm';
import TransactionForm from '@/components/TransactionForm';
import { categoryService } from '@/services/category.service';
import { transactionService } from '@/services/transaction.service';
import type { Category } from '@/types/category';
import type { Transaction, TransactionSummary } from '@/types/transaction';

export default function ManagePage() {
    const [activeTab, setActiveTab] = useState<'categories' | 'transactions'>('transactions');
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [cats, txns, sum] = await Promise.all([
                categoryService.getAll(),
                transactionService.getRecent(),
                transactionService.getSummary()
            ]);
            setCategories(cats);
            setTransactions(txns);
            setSummary(sum);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCategoryCreated = () => {
        loadData(); // Reload all data
    };

    const handleTransactionCreated = () => {
        loadData(); // Reload all data
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Quản Lý Chi Tiêu</h1>
                        <p className="text-gray-600 mt-1">Thêm và theo dõi giao dịch của bạn</p>
                    </div>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        ← Về trang chủ
                    </Link>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="text-green-100 text-sm font-semibold mb-1">Tổng Thu</div>
                            <div className="text-3xl font-bold">{summary.totalIncome.toLocaleString()} đ</div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="text-red-100 text-sm font-semibold mb-1">Tổng Chi</div>
                            <div className="text-3xl font-bold">{summary.totalExpense.toLocaleString()} đ</div>
                        </div>

                        <div className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white rounded-xl p-6 shadow-lg`}>
                            <div className={`${summary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-semibold mb-1`}>
                                Số Dư
                            </div>
                            <div className="text-3xl font-bold">{summary.balance.toLocaleString()} đ</div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${activeTab === 'transactions'
                                ? 'bg-white text-blue-600 shadow-lg scale-105'
                                : 'bg-white/50 text-gray-600 hover:bg-white/80'
                            }`}
                    >
                        💸 Giao Dịch
                    </button>

                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all ${activeTab === 'categories'
                                ? 'bg-white text-purple-600 shadow-lg scale-105'
                                : 'bg-white/50 text-gray-600 hover:bg-white/80'
                            }`}
                    >
                        📁 Danh Mục
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Column */}
                    <div>
                        {activeTab === 'transactions' ? (
                            <TransactionForm onSuccess={handleTransactionCreated} />
                        ) : (
                            <CategoryForm onSuccess={handleCategoryCreated} />
                        )}
                    </div>

                    {/* List Column */}
                    <div>
                        {activeTab === 'transactions' ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Giao Dịch Gần Đây</h3>
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                                ) : transactions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Chưa có giao dịch nào
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {transactions.map((txn) => (
                                            <div key={txn.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="text-3xl">
                                                    {txn.category?.icon || (txn.type === 'INCOME' ? '💰' : '💸')}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
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
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Danh Mục ({categories.length})</h3>
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                                ) : categories.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Chưa có danh mục nào
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                className="p-4 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer"
                                                style={{ borderColor: cat.color || '#E5E7EB' }}
                                            >
                                                <div className="text-3xl mb-2 text-center">{cat.icon || '📁'}</div>
                                                <div className="text-sm font-semibold text-gray-900 text-center truncate">
                                                    {cat.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
