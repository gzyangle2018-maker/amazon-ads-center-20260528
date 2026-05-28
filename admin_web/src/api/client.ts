import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  timeout: 30000,
})

// 请求拦截器: 添加Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器: 处理401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// === 认证 ===
export const loginApi = (username: string, password: string) =>
  api.post('/api/auth/login', { username, password })

// === Dashboard ===
export const getDashboard = () => api.get('/api/admin/dashboard')

// === 上传记录 ===
export const getUploads = (params?: any) => api.get('/api/admin/uploads', { params })

// === 分析结果 ===
export const getAnalysis = (params?: any) => api.get('/api/admin/analysis', { params })

// === 执行动作 ===
export const getActions = (params?: any) => api.get('/api/admin/actions', { params })

// === 缺失数据 ===
export const getMissing = () => api.get('/api/admin/missing')

// === 用户管理 ===
export const getUsers = () => api.get('/api/admin/users')
export const createUser = (data: any) => api.post('/api/users/', data)
export const toggleUser = (id: number) => api.put(`/api/users/${id}/toggle`)

// === 报告下载 ===
export const downloadReport = (taskId: number) =>
  api.get(`/api/reports/${taskId}/download`, { responseType: 'blob' })

export default api
