import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { isDemoMode } from '../api/supabaseClient'

export default function AboutPage() {
  useDocumentTitle('소개')
  return (
    <article className="card detail">
      <h1>소개</h1>
      <p>명화 감상 노트는 React로 만든 SPA(Single Page Application)입니다.</p>
      <ul>
        <li>React 19 + Vite</li>
        <li>React Router (페이지 이동)</li>
        <li>Supabase (원격 데이터베이스)</li>
      </ul>
      <p className="muted">
        현재 저장소: <strong>{isDemoMode ? '브라우저 (데모 모드)' : 'Supabase'}</strong>
      </p>
    </article>
  )
}
