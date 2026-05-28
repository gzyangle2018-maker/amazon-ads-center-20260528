import { useEffect, useState } from 'react'
import { getAnalysis, getActions, getMissing, getUsers } from '../api/client'

// 通用表格页面组件
function DataPage({ title, fetchFn, columns, emptyText = '暂无数据' }: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFn().then((res: any) => setData(res.data)).finally(() => setLoading(false))
  }, [fetchFn])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              {columns.map((h: string) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">加载中...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">{emptyText}</td></tr>
            ) : data.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:bg-gray-900/50">
                {columns.map((col: string) => (
                  <td key={col} className="px-4 py-3 text-gray-300">
                    {typeof item[col] === 'object' ? JSON.stringify(item[col]) : String(item[col] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const analysisCols = ['id', 'task_name', 'date_range', 'status', 'created_at']
const actionCols = ['id', 'asin', 'priority', 'campaign_name', 'target_text', 'action', 'status']
const missingCols = ['id', 'asin', 'missing_report', 'affected_module', 'is_blocking', 'status']
const userCols = ['id', 'username', 'role', 'display_name', 'is_active', 'created_at']

export function AnalysisResults() {
  return <DataPage title="分析结果" fetchFn={getAnalysis} columns={analysisCols} emptyText="暂无分析记录" />
}

export function ExecutionTasks() {
  return <DataPage title="执行清单" fetchFn={getActions} columns={actionCols} emptyText="暂无执行动作" />
}

export function MissingReports() {
  return <DataPage title="缺失数据" fetchFn={getMissing} columns={missingCols} emptyText="暂无缺失数据" />
}

export function UsersPage() {
  return <DataPage title="用户管理" fetchFn={getUsers} columns={userCols} emptyText="暂无用户" />
}
