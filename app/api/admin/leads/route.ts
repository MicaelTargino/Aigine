import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plan = searchParams.get('plan')
    const urgency = searchParams.get('urgency')

    const where: any = {}
    if (plan) where.plan = plan
    if (urgency) where.urgency = urgency

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        role: true,
        teamSize: true,
        plan: true,
        budgetRange: true,
        urgency: true,
        createdAt: true
      }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}