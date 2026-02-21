-- Create tables for Aigine analytics and lead management

-- Visitors table
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vid TEXT UNIQUE NOT NULL,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sid TEXT UNIQUE NOT NULL,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  path TEXT,
  section_id TEXT,
  payload JSONB,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size TEXT,
  repo_size TEXT,
  plan TEXT,
  budget_range TEXT,
  no_brainer_price NUMERIC,
  urgency TEXT,
  disappointment TEXT,
  ai_tools TEXT,
  pain TEXT,
  notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_visitors_vid ON visitors(vid);
CREATE INDEX idx_visitors_first_seen ON visitors(first_seen_at);
CREATE INDEX idx_sessions_sid ON sessions(sid);
CREATE INDEX idx_sessions_visitor ON sessions(visitor_id);
CREATE INDEX idx_events_type_created ON events(type, created_at);
CREATE INDEX idx_events_visitor_created ON events(visitor_id, created_at);
CREATE INDEX idx_events_path_created ON events(path, created_at);
CREATE INDEX idx_events_section_created ON events(section_id, created_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_plan ON leads(plan);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for analytics)
CREATE POLICY "Enable insert for all users" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON leads FOR INSERT WITH CHECK (true);

-- Update policies (for updating last_seen_at)
CREATE POLICY "Enable update for all users" ON visitors FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON sessions FOR UPDATE USING (true);

-- Admin read access (you'll need to set up authentication for this)
-- For now, we'll allow public read for development
CREATE POLICY "Temporary public read" ON visitors FOR SELECT USING (true);
CREATE POLICY "Temporary public read" ON sessions FOR SELECT USING (true);
CREATE POLICY "Temporary public read" ON events FOR SELECT USING (true);
CREATE POLICY "Temporary public read" ON leads FOR SELECT USING (true);