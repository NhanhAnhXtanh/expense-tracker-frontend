import { useState, useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import CategoryForm from '@/components/CategoryForm';
import type { Category, UpdateCategoryRequest } from '@/types/category';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const cats = await categoryService.getAll();
            setCategories(cats);
        } catch (err) {
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
            return;
        }

        try {
            await categoryService.delete(id);
            alert(`Đã xóa danh mục "${name}"`);
            loadData();
        } catch (err: any) {
            alert(`Lỗi: ${err.message || 'Không thể xóa danh mục'}`);
        }
    };

    const handleEdit = async (category: Category, updatedData: UpdateCategoryRequest) => {
        try {
            await categoryService.update(category.id, updatedData);
            alert(`Đã cập nhật danh مục "${updatedData.name}"`);
            setEditingCategory(null);
            loadData();
        } catch (err: any) {
            alert(`Lỗi: ${err.message || 'Không thể cập nhật danh mục'}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-purple-100 text-sm mb-1">Tổng số danh mục</div>
                        <div className="text-4xl font-bold">{categories.length}</div>
                    </div>
                    <div className="text-6xl">📁</div>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                    {showForm ? '✕ Đóng Form' : '+ Thêm Danh Mục'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="animate-fadeIn">
                    <CategoryForm
                        onSuccess={() => {
                            loadData();
                            setShowForm(false);
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">✏️ Sửa Danh Mục</h3>
                        <EditCategoryForm
                            category={editingCategory}
                            onSave={(data) => handleEdit(editingCategory, data)}
                            onCancel={() => setEditingCategory(null)}
                        />
                    </div>
                </div>
            )}

            {/* Categories Grid */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Danh Sách Danh Mục</h3>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📁</div>
                        <p className="mb-4">Chưa có danh mục nào</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Tạo danh mục đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="group relative overflow-hidden rounded-2xl border-2 hover:shadow-2xl transition-all"
                                style={{ borderColor: cat.color || '#E5E7EB' }}
                            >
                                {/* Background Gradient */}
                                <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                                    style={{
                                        background: `linear-gradient(135deg, ${cat.color || '#6366f1'}, transparent)`,
                                    }}
                                ></div>

                                {/* Content */}
                                <div className="relative p-6">
                                    <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                                        {cat.icon || '📁'}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900 mb-1 truncate">
                                            {cat.name}
                                        </div>
                                        <div
                                            className="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                                            style={{
                                                backgroundColor: `${cat.color || '#6366f1'}20`,
                                                color: cat.color || '#6366f1',
                                            }}
                                        >
                                            {cat.color}
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setEditingCategory(cat)}
                                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">Gợi Ý Sử Dụng Danh Mục</h3>
                        <p className="text-indigo-100 text-sm">
                            Tạo danh mục chi tiết giúp bạn phân loại chi tiêu rõ ràng hơn.
                            Ví dụ: "Ăn uống - Nhà hàng", "Ăn uống - Cafe", "Di chuyển - Xe ôm", v.v.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline Edit Form Component
function EditCategoryForm({
    category,
    onSave,
    onCancel,
}: {
    category: Category;
    onSave: (data: UpdateCategoryRequest) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<UpdateCategoryRequest>({
        name: category.name,
        icon: category.icon || '',
        color: category.color || '#3B82F6',
        parentId: category.parentId,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const commonEmojis = ['💰', '🍔', '🚗', '🏠', '📱', '💊', '🎮', '✈️', '📚', '🎬', '🛒', '⚡'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            {/* Icon */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                    {commonEmojis.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: emoji })}
                            className={`p-2 text-xl rounded-lg border-2 ${formData.icon === emoji ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
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
                />
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Màu sắc</label>
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
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
                >
                    💾 Lưu
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}
