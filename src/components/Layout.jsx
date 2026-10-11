import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import DemoBanner from './DemoBanner'

// 모든 페이지가 공유하는 뼈대. <Outlet /> 자리에 각 페이지가 들어옵니다.
// key={pathname} → 주소가 바뀔 때마다 새로 그려지며 "스르륵" 애니메이션이 다시 재생됩니다.
export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <NavBar />
      <DemoBanner />
      <main className="container page-fade" key={pathname}>
        <Outlet />
      </main>
      <footer className="footer">명화 감상 노트 · React + Supabase</footer>
    </>
  )
}
