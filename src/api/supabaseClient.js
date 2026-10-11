import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// .env 가 비어 있으면 null → notesApi 가 브라우저 저장소(데모 모드)로 동작합니다.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const isDemoMode = !supabase
