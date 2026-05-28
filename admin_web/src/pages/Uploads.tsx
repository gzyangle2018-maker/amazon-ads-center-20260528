import { useEffect, useState } from 'react'
import { getUploads } from '../api/client'

export default function Uploads() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUploads().then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">上传记录</h2>
      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              {['ID','运营','文件名','报表类型','置信度','状态','时间'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">加载中...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">暂无数据</td></tr>
            ) : data.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-900/50">
                <td className="px-4 py-3 text-gray-300">{item.id}</td>
                <td className="px-4 py-3 text-gray-300">{item.operator}</td>
                <td className="px-4 py-3 text-white">{item.filename}</td>
                <td className="px-4 py-3 text-gray-300">{item.report_type || '-'}</td>
                <td className="px-4 py-3 text-gray-300">{item.confidence ? `${(item.confidence*100).toFixed(0)}%` : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === 'uploaded' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                  }`}>{item.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{item.created_at?.slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
