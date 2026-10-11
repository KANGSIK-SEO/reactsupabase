import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '홈', end: true },
  { to: '/notes', label: '감상 노트', end: true },
  { to: '/notes/new', label: '새 노트' },
  { to: '/about', label: '소개' },
]

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">🖼️ 명화 감상 노트</NavLink>
        <nav className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
