// onChange 가 있으면 클릭해서 고르는 입력용, 없으면 보기 전용
export default function StarRating({ value = 0, onChange }) {
  return (
    <span className={`stars ${onChange ? 'stars-input' : ''}`} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button type="button" key={n} onClick={() => onChange(n)} aria-label={`${n}점`}>
            {n <= value ? '★' : '☆'}
          </button>
        ) : (
          <span key={n}>{n <= value ? '★' : '☆'}</span>
        ),
      )}
    </span>
  )
}
