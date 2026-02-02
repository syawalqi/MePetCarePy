-- Create User Sessions table for concurrent session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_sessions_user_id_key UNIQUE (user_id)
);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS ix_user_sessions_session_token ON public.user_sessions(session_token);

-- Enable RLS (though mostly managed by backend)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Only Service Role can manage sessions (no direct client access)
-- No policies defined = Deny All by default
