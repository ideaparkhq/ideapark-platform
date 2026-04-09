import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  const url = 'https://xleefaicvzrjqrhabgwj.supabase.co'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWVmYWljdnpyanFyaGFiZ3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzEzNTUsImV4cCI6MjA5MTI0NzM1NX0.NmUD_78wsGZWa14nXNSJJfF7UBdGIlBAPgLkgfdrXTQ'
  
  client = createBrowserClient(url, key)
  return client
}
