'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, TrendingUp, MousePointer, Eye } from 'lucide-react'

interface Metrics {
  visitorsToday: number
  visitorsWeek: number
  visitorsMonth: number
  totalLeads: number
  returningRate: string
  conversionRate: string
  conversionEvents: number
  planDistribution: Array<{ plan: string | null; count: number }>
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    visitorsToday: 0,
    visitorsWeek: 0,
    visitorsMonth: 0,
    totalLeads: 0,
    returningRate: '0',
    conversionRate: '0',
    conversionEvents: 0,
    planDistribution: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      try {
        // Fetch visitors today
        const { count: visitorsToday } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true })
          .gte('first_seen_at', today.toISOString())

        // Fetch visitors last 7 days
        const { count: visitorsWeek } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true })
          .gte('first_seen_at', sevenDaysAgo.toISOString())

        // Fetch visitors last 30 days
        const { count: visitorsMonth } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true })
          .gte('first_seen_at', thirtyDaysAgo.toISOString())

        // Fetch total leads
        const { count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })

        // Fetch total visitors
        const { count: totalVisitors } = await supabase
          .from('visitors')
          .select('*', { count: 'exact', head: true })

        // Fetch CTA clicks
        const { count: conversionEvents } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'cta_click')
          .gte('created_at', thirtyDaysAgo.toISOString())

        // Fetch plan distribution
        const { data: leads } = await supabase
          .from('leads')
          .select('plan')
          .not('plan', 'is', null)

        const planCounts: Record<string, number> = {}
        leads?.forEach(lead => {
          if (lead.plan) {
            planCounts[lead.plan] = (planCounts[lead.plan] || 0) + 1
          }
        })

        const planDistribution = Object.entries(planCounts).map(([plan, count]) => ({
          plan,
          count
        }))

        // Calculate rates
        const returningRate = totalVisitors && totalVisitors > 0 
          ? ((visitorsWeek! / totalVisitors) * 100).toFixed(1)
          : '0'

        const conversionRate = visitorsMonth && visitorsMonth > 0
          ? ((totalLeads! / visitorsMonth) * 100).toFixed(2)
          : '0'

        setMetrics({
          visitorsToday: visitorsToday || 0,
          visitorsWeek: visitorsWeek || 0,
          visitorsMonth: visitorsMonth || 0,
          totalLeads: totalLeads || 0,
          returningRate,
          conversionRate,
          conversionEvents: conversionEvents || 0,
          planDistribution
        })
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading Dashboard...</h1>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Visitors Today</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.visitorsToday}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Last 7 Days</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.visitorsWeek}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Last 30 Days</span>
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.visitorsMonth}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Leads</span>
            <MousePointer className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Returning Visitors</h3>
          <div className="text-3xl font-bold text-blue-600">{metrics.returningRate}%</div>
          <p className="text-sm text-gray-500 mt-1">of total visitors</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600">{metrics.conversionRate}%</div>
          <p className="text-sm text-gray-500 mt-1">visitors to leads (30d)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">CTA Clicks</h3>
          <div className="text-3xl font-bold text-purple-600">{metrics.conversionEvents}</div>
          <p className="text-sm text-gray-500 mt-1">in last 30 days</p>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Interest Distribution</h3>
        <div className="space-y-3">
          {metrics.planDistribution.map((plan) => (
            <div key={plan.plan || 'unknown'} className="flex items-center justify-between">
              <span className="text-gray-700">{plan.plan || 'Not specified'}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${(plan.count / metrics.totalLeads) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-gray-600 text-sm w-12 text-right">{plan.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}