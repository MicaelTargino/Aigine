import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'default-salt'
  return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

function getRateLimitKey(ip: string, vid: string): string {
  return `${hashIP(ip)}-${vid}`
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60000 }) // 1 minute window
    return false
  }
  
  if (limit.count >= 100) { // 100 requests per minute
    return true
  }
  
  limit.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
    const body = await request.json()
    const { vid, sid, events } = body
    
    if (!vid || !sid || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    
    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, vid)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }
    
    // Get or create visitor
    let visitor = await prisma.visitor.findUnique({
      where: { vid }
    })
    
    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: { vid }
      })
    } else {
      await prisma.visitor.update({
        where: { id: visitor.id },
        data: { lastSeenAt: new Date() }
      })
    }
    
    // Get or create session
    let session = await prisma.session.findUnique({
      where: { sid }
    })
    
    if (!session) {
      session = await prisma.session.create({
        data: {
          sid,
          visitorId: visitor.id
        }
      })
    } else {
      await prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date() }
      })
    }
    
    // Store events
    const eventData = events.map((event: any) => ({
      type: event.type,
      visitorId: visitor.id,
      sessionId: session.id,
      path: event.path,
      sectionId: event.sectionId,
      payload: event.payload,
      ipHash: hashIP(ip),
      userAgent: event.payload?.user_agent
    }))
    
    await prisma.event.createMany({
      data: eventData
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}