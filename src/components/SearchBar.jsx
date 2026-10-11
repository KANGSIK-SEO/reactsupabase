// 상태(value)는 부모가 들고 있고, 이 컴포넌트는 보여주고 알려주기만 합니다. (상태 끌어올리기)
export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="input search"
      type="search"
      placeholder="작품명 또는 작가로 검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
