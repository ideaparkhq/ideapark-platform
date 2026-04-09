import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xleefaicvzrjqrhabgwj.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWVmYWljdnpyanFyaGFiZ3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzEzNTUsImV4cCI6MjA5MTI0NzM1NX0.NmUD_78wsGZWa14nXNSJJfF7UBdGIlBAPgLkgfdrXTQ'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
