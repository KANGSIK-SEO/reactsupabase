export default function LoadingState({ message = '불러오는 중...' }) {
  return (
    <div className="state" role="status">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  )
}
