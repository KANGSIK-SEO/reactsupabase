import Button from './Button'

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <p className="state-icon">⚠️</p>
      <p>문제가 생겼어요.</p>
      <p className="muted">{error?.message ?? '알 수 없는 오류'}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>다시 시도</Button>}
    </div>
  )
}
