/**
 * Category types
 */

export interface Category {
    id: string;
    name: string;
    parentId?: string | null;
    icon?: string | null;
    color?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    parentId?: string | null;
    icon?: string | null;
    color?: string | null;
}

export interface UpdateCategoryRequest {
    name: string;
    parentId?: string | null;
    icon?: string | null;
    color?: string | null;
}
