import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get visitor ID from cookies
    const cookies = request.headers.get('cookie') || ''
    const vidMatch = cookies.match(/vid=([^;]+)/)
    const vid = vidMatch ? vidMatch[1] : null
    
    let visitorId: string | null = null
    if (vid) {
      const { data: visitor } = await supabase
        .from('visitors')
        .select('id')
        .eq('vid', vid)
        .single()
      
      visitorId = visitor?.id || null
    }
    
    // Create lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        visitor_id: visitorId,
        name: body.name,
        email: body.email,
        company: body.company,
        role: body.role,
        team_size: body.teamSize,
        repo_size: body.repoSize,
        plan: body.plan,
        budget_range: body.budgetRange,
        no_brainer_price: body.noBrainerPrice ? parseFloat(body.noBrainerPrice) : null,
        urgency: body.urgency,
        disappointment: body.disappointment,
        ai_tools: body.aiTools,
        pain: body.pain,
        notes: body.notes || {}
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Lead creation error:', error)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}