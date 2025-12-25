import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth-context'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
