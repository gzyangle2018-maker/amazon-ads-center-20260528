const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.amazon-ads-center.workers.dev'

export interface Campaign {
  id: string
  name: string
  status: 'enabled' | 'paused' | 'archived'
  budget: number
  spent: number
  impressions: number
  clicks: number
  orders: number
  sales: number
  acos: number
  roas: number
  startDate: string
  targeting: 'auto' | 'manual'
}

export interface DashboardData {
  summary: {
    impressions: number
    clicks: number
    spend: number
    sales: number
    acos: number
    roas: number
    ctr: number
    cpc: number
  }
  dailyTrend: Array<{
    date: string
    spend: number
    sales: number
    impressions: number
    clicks: number
  }>
  campaigns: Campaign[]
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE}/api/dashboard`)
  if (!res.ok) throw new Error('Failed to fetch dashboard')
  return res.json()
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/api/campaigns`)
  if (!res.ok) throw new Error('Failed to fetch campaigns')
  return res.json()
}

export async function updateCampaignStatus(
  id: string,
  status: 'enabled' | 'paused' | 'archived'
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update campaign')
}
