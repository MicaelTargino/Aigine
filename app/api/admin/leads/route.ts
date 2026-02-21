import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plan = searchParams.get('plan')
    const urgency = searchParams.get('urgency')

    let query = supabase
      .from('leads')
      .select('id, name, email, company, role, team_size, plan, budget_range, urgency, created_at')
      .order('created_at', { ascending: false })

    if (plan) {
      query = query.eq('plan', plan)
    }
    if (urgency) {
      query = query.eq('urgency', urgency)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Failed to fetch leads:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    // Transform snake_case to camelCase for compatibility
    const transformedLeads = leads?.map(lead => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      role: lead.role,
      teamSize: lead.team_size,
      plan: lead.plan,
      budgetRange: lead.budget_range,
      urgency: lead.urgency,
      createdAt: lead.created_at
    })) || []

    return NextResponse.json(transformedLeads)
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}