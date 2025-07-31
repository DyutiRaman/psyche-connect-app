import { AdminLogin as AdminLoginComponent } from '@/components/AdminLogin'
import { Navigate } from 'react-router-dom'

interface AdminLoginPageProps {
  onLogin: () => void
  isAuthenticated: boolean
}

const AdminLoginPage = ({ onLogin, isAuthenticated }: AdminLoginPageProps) => {
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <AdminLoginComponent onLogin={onLogin} />
}

export default AdminLoginPage