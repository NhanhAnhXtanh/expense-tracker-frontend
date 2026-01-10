import type {
    Transaction,
    CreateTransactionRequest,
    UpdateTransactionRequest,
    TransactionSummary,
    PagedResponse,
    TransactionType
} from '@/types/transaction';

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
 * Build query string from params
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
}

/**
 * Transaction API Service
 */
export const transactionService = {
    /**
     * Get all transactions with filters and pagination
     */
    async getAll(params?: {
        page?: number;
        size?: number;
        sort?: string;
        type?: TransactionType;
        categoryId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<PagedResponse<Transaction>> {
        const queryString = params ? buildQueryString(params) : '';
        const url = `${API_BASE_URL}/transactions${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        return response.json();
    },

    /**
     * Get recent transactions (top 10)
     */
    async getRecent(): Promise<Transaction[]> {
        const response = await fetch(`${API_BASE_URL}/transactions/recent`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recent transactions');
        }

        return response.json();
    },

    /**
     * Get summary (total income/expense/balance)
     */
    async getSummary(params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<TransactionSummary> {
        const queryString = params ? buildQueryString(params) : '';
        const url = `${API_BASE_URL}/transactions/summary${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch summary');
        }

        return response.json();
    },

    /**
     * Get transaction by ID
     */
    async getById(id: string): Promise<Transaction> {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            headers: createHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transaction');
        }

        return response.json();
    },

    /**
     * Create new transaction
     */
    async create(data: CreateTransactionRequest): Promise<Transaction> {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create transaction');
        }

        return response.json();
    },

    /**
     * Update transaction
     */
    async update(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update transaction');
        }

        return response.json();
    },

    /**
     * Delete transaction
     */
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete transaction');
        }
    }
};
