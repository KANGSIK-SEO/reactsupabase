import { isDemoMode } from '../api/supabaseClient'

export default function DemoBanner() {
  if (!isDemoMode) return null
  return (
    <div className="demo-banner">
      데모 모드: Supabase 설정(.env)이 없어 이 브라우저에만 저장됩니다.
    </div>
  )
}
