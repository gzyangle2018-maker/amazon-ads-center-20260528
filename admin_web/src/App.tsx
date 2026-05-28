import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Uploads from './pages/Uploads'
import { AnalysisResults, ExecutionTasks, MissingReports, UsersPage } from './pages/ManagementPages'
import ReportsDownload from './pages/ReportsDownload'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/uploads" element={<Uploads />} />
          <Route path="/analysis" element={<AnalysisResults />} />
          <Route path="/missing" element={<MissingReports />} />
          <Route path="/tasks" element={<ExecutionTasks />} />
          <Route path="/reports" element={<ReportsDownload />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
