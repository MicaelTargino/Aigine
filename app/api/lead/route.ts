import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get visitor ID from cookies
    const cookies = request.headers.get('cookie') || ''
    const vidMatch = cookies.match(/vid=([^;]+)/)
    const vid = vidMatch ? vidMatch[1] : null
    
    let visitorId: string | null = null
    if (vid) {
      const visitor = await prisma.visitor.findUnique({
        where: { vid }
      })
      visitorId = visitor?.id || null
    }
    
    // Create lead
    const lead = await prisma.lead.create({
      data: {
        visitorId,
        name: body.name,
        email: body.email,
        company: body.company,
        role: body.role,
        teamSize: body.teamSize,
        repoSize: body.repoSize,
        plan: body.plan,
        budgetRange: body.budgetRange,
        noBrainerPrice: body.noBrainerPrice ? parseFloat(body.noBrainerPrice) : null,
        urgency: body.urgency,
        disappointment: body.disappointment,
        aiTools: body.aiTools,
        pain: body.pain,
        notes: body.notes || {}
      }
    })
    
    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}