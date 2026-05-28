import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Upload, FileSearch, AlertTriangle,
  CheckSquare, FileDown, Users, LogOut, Menu, X, BarChart3,
} from 'lucide-react'

const navItems = [
  { to: '/', label: '仪表盘', icon: LayoutDashboard },
  { to: '/uploads', label: '上传记录', icon: Upload },
  { to: '/analysis', label: '分析结果', icon: FileSearch },
  { to: '/missing', label: '缺失数据', icon: AlertTriangle },
  { to: '/tasks', label: '执行清单', icon: CheckSquare },
  { to: '/reports', label: '报告下载', icon: FileDown },
  { to: '/users', label: '用户管理', icon: Users },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 border-r border-gray-800 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Amazon Ads</h1>
            <p className="text-xs text-gray-500">管理后台</p>
          </div>
          <button className="ml-auto rounded p-1 hover:bg-gray-800 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" />退出登录
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-gray-800 bg-gray-900 px-6">
          <button className="rounded-lg p-2 hover:bg-gray-800 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-gray-400" />
          </button>
          <div className="flex-1" />
          <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-orange-400">A</span>
          </div>
          <span className="text-sm text-gray-400 hidden sm:inline">Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
