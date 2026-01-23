import { useState } from 'react';
import { categoryService } from '@/services/category.service';
import type { Category, CreateCategoryRequest } from '@/types/category';

interface CategoryFormProps {
    onSuccess?: (category: Category) => void;
    onCancel?: () => void;
}

export default function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
    const [formData, setFormData] = useState<CreateCategoryRequest>({
        name: '',
        icon: '',
        color: '#3B82F6',
        parentId: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const created = await categoryService.create(formData);
            console.log('Created category:', created);

            // Reset form
            setFormData({
                name: '',
                icon: '',
                color: '#3B82F6',
                parentId: null
            });

            if (onSuccess) {
                onSuccess(created);
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
            console.error('Error creating category:', err);
        } finally {
            setLoading(false);
        }
    };

    const commonEmojis = ['💰', '🍔', '🚗', '🏠', '📱', '💊', '🎮', '✈️', '📚', '🎬', '🛒', '⚡'];

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">➕ Thêm Danh Mục Mới</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Tên danh mục */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Ăn uống, Di chuyển..."
                    maxLength={100}
                    required
                />
            </div>

            {/* Chọn icon */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biểu tượng
                </label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                    {commonEmojis.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: emoji })}
                            className={`p-3 text-2xl rounded-lg border-2 transition-all ${formData.icon === emoji
                                    ? 'border-blue-500 bg-blue-50 scale-110'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl"
                    placeholder="hoặc nhập emoji..."
                    maxLength={50}
                />
            </div>

            {/* Chọn màu */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Màu sắc
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="color"
                        value={formData.color || '#3B82F6'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="h-12 w-24 rounded-lg cursor-pointer"
                    />
                    <input
                        type="text"
                        value={formData.color || ''}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg uppercase"
                        placeholder="#3B82F6"
                        maxLength={7}
                    />
                    <div
                        className="h-12 w-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: formData.color || '#3B82F6' }}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
                        '✨ Tạo Danh Mục'
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
