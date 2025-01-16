import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntnkfyhrqqqiviksbusd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bmtmeWhycXFxaXZpa3NidXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDUzMTAsImV4cCI6MjA1MjUyMTMxMH0.xfod7pjiJChdZXjhuZ3UMNNvBcOakAPRPjjsLU7hdI4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

