/**
 * Transaction types
 */

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionSource = 'MANUAL' | 'IMPORT_CSV' | 'IMPORT_JSON' | 'BANK_SYNC';

export interface CategoryInfo {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    transactionDate: string; // ISO date string
    note?: string | null;
    rawDescription?: string | null;
    source: TransactionSource;
    createdAt: string;
    updatedAt: string;
    category?: CategoryInfo | null;
}

export interface CreateTransactionRequest {
    categoryId?: string | null;
    amount: number;
    type: TransactionType;
    transactionDate: string;
    note?: string | null;
    rawDescription?: string | null;
    source?: TransactionSource;
}

export interface UpdateTransactionRequest {
    categoryId?: string | null;
    amount: number;
    type: TransactionType;
    transactionDate: string;
    note?: string | null;
    rawDescription?: string | null;
    source?: TransactionSource;
}

export interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    startDate: string;
    endDate: string;
}

export interface PagedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
