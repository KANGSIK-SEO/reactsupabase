import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  useDocumentTitle('페이지 없음')
  return (
    <EmptyState message="404 · 찾는 페이지가 없어요.">
      <Link to="/" className="btn btn-primary">홈으로</Link>
    </EmptyState>
  )
}
