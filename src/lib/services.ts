import apiClient from './api'

// Types based on your Jmix entities
export interface User {
    id: string
    username: string
    firstName?: string
    lastName?: string
    email?: string
}

export interface Expense {
    id: string
    amount: number
    description: string
    date: string
    category?: string
}

// Jmix REST API endpoints use /entities/{EntityName}
export const userApi = {
    getUsers: () => apiClient.get<User[]>('/entities/User'),
    getUserById: (id: string) => apiClient.get<User>(`/entities/User/${id}`),
}

export const expenseApi = {
    getExpenses: () => apiClient.get<Expense[]>('/entities/Expense'),
    getExpenseById: (id: string) => apiClient.get<Expense>(`/entities/Expense/${id}`),
    createExpense: (expense: Omit<Expense, 'id'>) =>
        apiClient.post<Expense>('/entities/Expense', expense),
    updateExpense: (id: string, expense: Partial<Expense>) =>
        apiClient.put<Expense>(`/entities/Expense/${id}`, expense),
    deleteExpense: (id: string) =>
        apiClient.delete(`/entities/Expense/${id}`),
}

// Health check (doesn't need auth usually)
export const healthApi = {
    check: () => apiClient.get('/actuator/health'),
}
