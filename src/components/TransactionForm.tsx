import { useState, useEffect } from 'react';
import { transactionService } from '@/services/transaction.service';
import { categoryService } from '@/services/category.service';
import type { Transaction, CreateTransactionRequest } from '@/types/transaction';
import type { Category } from '@/types/category';

interface TransactionFormProps {
    onSuccess?: (transaction: Transaction) => void;
    onCancel?: () => void;
}

export default function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<CreateTransactionRequest>({
        amount: 0,
        type: 'EXPENSE',
        transactionDate: new Date().toISOString().split('T')[0],
        note: '',
        categoryId: null,
        source: 'MANUAL'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await categoryService.getAll();
                setCategories(cats);
            } catch (err) {
                console.error('Error loading categories:', err);
            }
        };
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.amount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const created = await transactionService.create(formData);
            console.log('Created transaction:', created);

            // Reset form
            setFormData({
                amount: 0,
                type: 'EXPENSE',
                transactionDate: new Date().toISOString().split('T')[0],
                note: '',
                categoryId: null,
                source: 'MANUAL'
            });

            if (onSuccess) {
                onSuccess(created);
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
            console.error('Error creating transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">💸 Thêm Giao Dịch Mới</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loại giao dịch */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại giao dịch <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                        className={`py-4 px-6 rounded-xl font-semibold transition-all ${formData.type === 'INCOME'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="text-2xl mb-1">💰</div>
                        Thu Nhập
                    </button>

                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                        className={`py-4 px-6 rounded-xl font-semibold transition-all ${formData.type === 'EXPENSE'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="text-2xl mb-1">💸</div>
                        Chi Tiêu
                    </button>
                </div>
            </div>

            {/* Số tiền */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số tiền <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-xl font-semibold"
                        placeholder="0"
                        min="0"
                        step="1000"
                        required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                        đ
                    </span>
                </div>
                {formData.amount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.amount.toLocaleString('vi-VN')} đồng
                    </p>
                )}
            </div>

            {/* Danh mục */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Danh mục
                </label>
                <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Không có danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ngày giao dịch */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày giao dịch <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            {/* Ghi chú */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ghi chú
                </label>
                <textarea
                    value={formData.note || ''}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Mô tả giao dịch..."
                    rows={3}
                    maxLength={500}
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === 'INCOME'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang tạo...
                        </span>
                    ) : (
                        '✨ Tạo Giao Dịch'
                    )}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}
