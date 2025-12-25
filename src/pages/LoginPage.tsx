import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/lib/auth-context'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSuccess = (response: any) => {
        if (response.credential) {
            login(response.credential)
            navigate('/')
        }
    }

    const handleError = () => {
        console.error('Google Login Failed')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Expense Tracker
                    </h1>
                    <p className="text-gray-600">
                        Đăng nhập bằng tài khoản Google của bạn
                    </p>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                        theme="filled_blue"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                    />
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p>Bằng cách đăng nhập, bạn đồng ý với</p>
                    <p>Điều khoản sử dụng và Chính sách bảo mật</p>
                </div>
            </div>
        </div>
    )
}
