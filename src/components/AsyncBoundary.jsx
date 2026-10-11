import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

// 로딩 → 에러 → 빈 상태 → 정상 화면, 이 순서를 모든 화면에서 똑같이 처리하는 컴포넌트
export default function AsyncBoundary({ loading, error, isEmpty, onRetry, empty, children }) {
  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (isEmpty) return empty ?? <EmptyState />
  return children
}
