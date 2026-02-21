import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Visitor {
  id: string
  vid: string
  first_seen_at: string
  last_seen_at: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  sid: string
  visitor_id: string
  started_at: string
  last_seen_at: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  type: string
  visitor_id: string
  session_id?: string
  path?: string
  section_id?: string
  payload?: any
  ip_hash?: string
  user_agent?: string
  created_at: string
}

export interface Lead {
  id: string
  visitor_id?: string
  name: string
  email: string
  company?: string
  role?: string
  team_size?: string
  repo_size?: string
  plan?: string
  budget_range?: string
  no_brainer_price?: number
  urgency?: string
  disappointment?: string
  ai_tools?: string
  pain?: string
  notes?: any
  created_at: string
  updated_at: string
}