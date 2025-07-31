import { AdminDashboard as AdminDashboardComponent } from '@/components/AdminDashboard'
import { Navigate } from 'react-router-dom'

interface AdminDashboardPageProps {
  onLogout: () => void
  isAuthenticated: boolean
}

const AdminDashboardPage = ({ onLogout, isAuthenticated }: AdminDashboardPageProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />
  }

  return <AdminDashboardComponent onLogout={onLogout} />
}

export default AdminDashboardPage