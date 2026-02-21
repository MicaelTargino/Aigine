import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
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
    let { data: visitor, error: visitorError } = await supabase
      .from('visitors')
      .select('*')
      .eq('vid', vid)
      .single()
    
    if (!visitor) {
      const { data: newVisitor, error: createError } = await supabase
        .from('visitors')
        .insert([{ vid }])
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating visitor:', createError)
        return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 })
      }
      visitor = newVisitor
    } else {
      // Update last_seen_at
      await supabase
        .from('visitors')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', visitor.id)
    }
    
    // Get or create session
    let { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('sid', sid)
      .single()
    
    if (!session) {
      const { data: newSession, error: createError } = await supabase
        .from('sessions')
        .insert([{ 
          sid,
          visitor_id: visitor.id
        }])
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating session:', createError)
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
      }
      session = newSession
    } else {
      // Update last_seen_at
      await supabase
        .from('sessions')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', session.id)
    }
    
    // Store events
    const eventData = events.map((event: any) => ({
      type: event.type,
      visitor_id: visitor.id,
      session_id: session.id,
      path: event.path,
      section_id: event.sectionId,
      payload: event.payload,
      ip_hash: hashIP(ip),
      user_agent: event.payload?.user_agent
    }))
    
    const { error: eventsError } = await supabase
      .from('events')
      .insert(eventData)
    
    if (eventsError) {
      console.error('Error storing events:', eventsError)
      return NextResponse.json({ error: 'Failed to store events' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}