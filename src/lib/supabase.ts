import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Booking = {
  id?: string
  name: string
  email: string
  phone: string
  preferred_time: string
  call_type: 'video' | 'voice'
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
}