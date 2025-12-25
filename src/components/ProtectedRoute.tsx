import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
