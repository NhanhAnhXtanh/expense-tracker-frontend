import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

/**
 * Get auth token from session storage
 */
function getAuthToken(): string | null {
    return sessionStorage.getItem('access_token');
}

/**
 * Create headers with auth token
 */
function createHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

/**
 * Category API Service
 */
export const categoryService = {
    /**
     * Get all categories
     */
    async getAll(): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return response.json();
    },

    /**
     * Get root categories
     */
    async getRootCategories(): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories/root`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch root categories');
        }

        return response.json();
    },

    /**
     * Get category by ID
     */
    async getById(id: string): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }

        return response.json();
    },

    /**
     * Get child categories
     */
    async getChildren(parentId: string): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories/${parentId}/children`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch child categories');
        }

        return response.json();
    },

    /**
     * Create new category
     */
    async create(data: CreateCategoryRequest): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create category');
        }

        return response.json();
    },

    /**
     * Update category
     */
    async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update category');
        }

        return response.json();
    },

    /**
     * Delete category
     */
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete category');
        }
    }
};
