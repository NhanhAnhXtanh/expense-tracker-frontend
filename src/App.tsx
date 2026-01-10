import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardPage from '@/pages/DashboardPage'
import TransactionsPage from '@/pages/TransactionsPage'
import CategoriesPage from '@/pages/CategoriesPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth-context'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Dashboard Routes với Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="analytics" element={<div className="text-center py-20 text-gray-500"><div className="text-6xl mb-4">📈</div><p>Analytics - Coming Soon</p></div>} />
        <Route path="settings" element={<div className="text-center py-20 text-gray-500"><div className="text-6xl mb-4">⚙️</div><p>Settings - Coming Soon</p></div>} />
      </Route>
    </Routes>
  )
}
