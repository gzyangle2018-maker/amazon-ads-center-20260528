import { useEffect, useState } from 'react'
import { getDashboard } from '../api/client'
import { Upload, FileSearch, AlertTriangle, CheckSquare, BarChart3 } from 'lucide-react'

interface DashboardData {
  today_uploads: number
  today_tasks: number
  high_risk_asins: number
  missing_data: number
  pending_actions: number
  done_actions: number
}

const cards = [
  { key: 'today_uploads', label: '今日上传文件', icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'today_tasks', label: '今日分析任务', icon: FileSearch, color: 'text-green-400', bg: 'bg-green-500/10' },
  { key: 'high_risk_asins', label: '高风险ASIN', icon: BarChart3, color: 'text-red-400', bg: 'bg-red-500/10' },
  { key: 'missing_data', label: '缺失数据任务', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { key: 'pending_actions', label: '待执行动作', icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { key: 'done_actions', label: '已完成动作', icon: CheckSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
]

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400">加载中...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">仪表盘</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.key} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {data ? (data as any)[card.key] : '-'}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
