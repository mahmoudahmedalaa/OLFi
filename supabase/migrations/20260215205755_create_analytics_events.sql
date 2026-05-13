
-- Analytics events table for tracking user behavior
CREATE TABLE IF NOT EXISTS analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    screen text,
    session_id text,
    created_at timestamptz DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_screen ON analytics_events(screen);

-- RLS: users can insert their own events, only service role can read
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can read all events" ON analytics_events
    FOR SELECT USING (auth.role() = 'service_role');

-- Also add residency_status to profiles if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'residency_status'
    ) THEN
        ALTER TABLE profiles ADD COLUMN residency_status text;
    END IF;
END $$;
;
