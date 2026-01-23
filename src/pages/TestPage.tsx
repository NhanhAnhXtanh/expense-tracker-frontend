import { useState, useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import { transactionService } from '@/services/transaction.service';
import type { Category } from '@/types/category';
import type { Transaction, TransactionSummary } from '@/types/transaction';

export default function TestPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Test Category APIs
    const testCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Testing Category APIs...');

            // 1. Get all categories
            const allCategories = await categoryService.getAll();
            console.log('All categories:', allCategories);
            setCategories(allCategories);

            // 2. Create new category
            const newCategory = await categoryService.create({
                name: 'Test Category ' + Date.now(),
                icon: '🧪',
                color: '#FF5733'
            });
            console.log('Created category:', newCategory);

            // 3. Refresh list
            const updated = await categoryService.getAll();
            setCategories(updated);

            alert('Category APIs working! Check console for details.');
        } catch (err: any) {
            setError(err.message);
            console.error('Category API error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Test Transaction APIs
    const testTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Testing Transaction APIs...');

            // 1. Get all transactions
            const allTransactions = await transactionService.getAll({
                page: 0,
                size: 10,
                sort: 'transactionDate,desc'
            });
            console.log('All transactions:', allTransactions);
            setTransactions(allTransactions.content);

            // 2. Get summary
            const summaryData = await transactionService.getSummary();
            console.log('Summary:', summaryData);
            setSummary(summaryData);

            // 3. Get recent
            const recent = await transactionService.getRecent();
            console.log('Recent transactions:', recent);

            alert('Transaction APIs working! Check console for details.');
        } catch (err: any) {
            setError(err.message);
            console.error('Transaction API error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Test Create Transaction
    const testCreateTransaction = async () => {
        try {
            setLoading(true);
            setError(null);

            const newTransaction = await transactionService.create({
                amount: Math.floor(Math.random() * 100000),
                type: Math.random() > 0.5 ? 'INCOME' : 'EXPENSE',
                transactionDate: new Date().toISOString().split('T')[0],
                note: 'Test transaction ' + Date.now(),
                source: 'MANUAL'
            });

            console.log('Created transaction:', newTransaction);

            // Refresh summary
            const summaryData = await transactionService.getSummary();
            setSummary(summaryData);

            // Refresh list
            const allTransactions = await transactionService.getAll({
                page: 0,
                size: 10
            });
            setTransactions(allTransactions.content);

            alert('Transaction created successfully!');
        } catch (err: any) {
            setError(err.message);
            console.error('Create transaction error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await categoryService.getAll();
                setCategories(cats);

                const txns = await transactionService.getAll({ page: 0, size: 10 });
                setTransactions(txns.content);

                const sum = await transactionService.getSummary();
                setSummary(sum);
            } catch (err: any) {
                console.error('Error loading data:', err);
            }
        };

        loadData();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">🧪 API Test Page</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Test Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                    onClick={testCategories}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Test Categories'}
                </button>

                <button
                    onClick={testTransactions}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Test Transactions'}
                </button>

                <button
                    onClick={testCreateTransaction}
                    disabled={loading}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Create Random Transaction'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Summary */}
                {summary && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">💰 Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Income:</span>
                                <span className="text-green-600 font-bold">
                                    {summary.totalIncome.toLocaleString()} đ
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Expense:</span>
                                <span className="text-red-600 font-bold">
                                    {summary.totalExpense.toLocaleString()} đ
                                </span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-900 font-bold">Balance:</span>
                                <span className={`font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {summary.balance.toLocaleString()} đ
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">📁 Categories ({categories.length})</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                <span className="text-2xl">{cat.icon || '📁'}</span>
                                <span className="flex-1">{cat.name}</span>
                                {cat.color && (
                                    <span
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                )}
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No categories yet</p>
                        )}
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white shadow rounded-lg p-6 col-span-2">
                    <h2 className="text-xl font-bold mb-4">💸 Recent Transactions ({transactions.length})</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {transactions.map((txn) => (
                            <div key={txn.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded border">
                                <div className="flex-1">
                                    <div className="font-medium">{txn.note || 'No description'}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(txn.transactionDate).toLocaleDateString('vi-VN')}
                                        {txn.category && ` • ${txn.category.icon} ${txn.category.name}`}
                                    </div>
                                </div>
                                <div className={`font-bold text-lg ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'INCOME' ? '+' : '-'}
                                    {txn.amount.toLocaleString()} đ
                                </div>
                                <div className="text-xs text-gray-400 uppercase">
                                    {txn.source}
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No transactions yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">📝 Instructions:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li><strong>Test Categories:</strong> Loads all categories and creates a new test category</li>
                    <li><strong>Test Transactions:</strong> Loads transactions, gets summary and recent items</li>
                    <li><strong>Create Random Transaction:</strong> Creates a new random transaction</li>
                    <li>Check browser console (F12) for detailed API responses</li>
                    <li>Make sure backend is running on <code>http://localhost:8081</code></li>
                </ul>
            </div>
        </div>
    );
}
