export default function EmptyState({ message = '아직 아무것도 없어요.', children }) {
  return (
    <div className="state">
      <p className="state-icon">🗂️</p>
      <p>{message}</p>
      {children}
    </div>
  )
}
