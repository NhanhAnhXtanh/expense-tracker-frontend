import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transaction.service';
import { categoryService } from '@/services/category.service';
import TransactionForm from '@/components/TransactionForm';
import type { Transaction, UpdateTransactionRequest } from '@/types/transaction';
import type { Category } from '@/types/category';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [txns, cats] = await Promise.all([
                transactionService.getRecent(),
                categoryService.getAll(),
            ]);
            setTransactions(txns);
            setCategories(cats);
        } catch (err) {
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, note: string) => {
        if (!confirm(`Bạn có chắc muốn xóa giao dịch "${note || 'này'}"?`)) {
            return;
        }

        try {
            await transactionService.delete(id);
            alert('Đã xóa giao dịch');
            loadData();
        } catch (err: any) {
            alert(`Lỗi: ${err.message || 'Không thể xóa giao dịch'}`);
        }
    };

    const handleEdit = async (txn: Transaction, data: UpdateTransactionRequest) => {
        try {
            await transactionService.update(txn.id, data);
            alert('Đã cập nhật giao dịch');
            setEditingTransaction(null);
            loadData();
        } catch (err: any) {
            alert(`Lỗi: ${err.message || 'Không thể cập nhật'}`);
        }
    };

    const filteredTransactions = transactions.filter((txn) => {
        const matchesSearch =
            !searchTerm ||
            txn.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || txn.type === filterType;
        const matchesCategory = filterCategory === 'all' || txn.category?.id === filterCategory;

        return matchesSearch && matchesType && matchesCategory;
    });

    const totalIncome = filteredTransactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header với Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 shadow-lg">
                    <div className="text-sm text-gray-600 mb-1">Tổng Giao Dịch</div>
                    <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg text-white">
                    <div className="text-sm text-green-100 mb-1">Thu Nhập</div>
                    <div className="text-2xl font-bold">{totalIncome.toLocaleString()} đ</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 shadow-lg text-white">
                    <div className="text-sm text-red-100 mb-1">Chi Tiêu</div>
                    <div className="text-2xl font-bold">{totalExpense.toLocaleString()} đ</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm giao dịch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="INCOME">💰 Thu nhập</option>
                        <option value="EXPENSE">💸 Chi tiêu</option>
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                    {showForm ? '✕ Đóng Form' : '+ Thêm Giao Dịch'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="animate-fadeIn">
                    <TransactionForm
                        onSuccess={() => {
                            loadData();
                            setShowForm(false);
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Edit Modal */}
            {editingTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">✏️ Sửa Giao Dịch</h3>
                        <EditTransactionForm
                            transaction={editingTransaction}
                            categories={categories}
                            onSave={(data) => handleEdit(editingTransaction, data)}
                            onCancel={() => setEditingTransaction(null)}
                        />
                    </div>
                </div>
            )}

            {/* Transactions List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Danh Sách Giao Dịch ({filteredTransactions.length})
                </h3>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📭</div>
                        <p>Không tìm thấy giao dịch nào</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {filteredTransactions.map((txn) => (
                            <div
                                key={txn.id}
                                className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100"
                            >
                                <div
                                    className="w-14 h-14 rounded-xl shadow-sm flex items-center justify-center text-2xl"
                                    style={{
                                        backgroundColor: txn.category?.color
                                            ? `${txn.category.color}20`
                                            : '#f3f4f6',
                                    }}
                                >
                                    {txn.category?.icon || (txn.type === 'INCOME' ? '💰' : '💸')}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">
                                        {txn.note || txn.category?.name || 'Không có mô tả'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{new Date(txn.transactionDate).toLocaleDateString('vi-VN')}</span>
                                        {txn.category && (
                                            <>
                                                <span>•</span>
                                                <span>{txn.category.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className={`text-xl font-bold ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'INCOME' ? '+' : '-'}
                                        {txn.amount.toLocaleString()} đ
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {txn.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingTransaction(txn)}
                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                                        title="Sửa"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(txn.id, txn.note || '')}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Edit Transaction Form Component
function EditTransactionForm({
    transaction,
    categories,
    onSave,
    onCancel,
}: {
    transaction: Transaction;
    categories: Category[];
    onSave: (data: UpdateTransactionRequest) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<UpdateTransactionRequest>({
        amount: transaction.amount,
        type: transaction.type,
        transactionDate: transaction.transactionDate,
        note: transaction.note || '',
        categoryId: transaction.category?.id || null,
        source: transaction.source,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loại</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                        className={`py-3 rounded-lg font-semibold ${formData.type === 'INCOME'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        💰 Thu
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                        className={`py-3 rounded-lg font-semibold ${formData.type === 'EXPENSE'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        💸 Chi
                    </button>
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền</label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Không có</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày</label>
                <input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Note */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
                <textarea
                    value={formData.note || ''}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className={`flex-1 font-semibold py-3 rounded-lg text-white ${formData.type === 'INCOME'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                >
                    💾 Lưu
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}
