import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import AsyncBoundary from '../components/AsyncBoundary'
import EmptyState from '../components/EmptyState'
import NoteList from '../components/NoteList'
import SearchBar from '../components/SearchBar'

export default function NotesPage() {
  useDocumentTitle('감상 노트')
  const { notes, loading, error, reload } = useNotes()
  // 검색어는 이 페이지에서만 필요한 상태 → 페이지에 두고 SearchBar 에 props 로 내려줌
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.artist.toLowerCase().includes(q))
    : notes

  return (
    <>
      <div className="page-header">
        <h1>감상 노트 <span className="muted small">({notes.length})</span></h1>
        <Link to="/notes/new" className="btn btn-primary">+ 새 노트</Link>
      </div>
      <SearchBar value={query} onChange={setQuery} />

      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={filtered.length === 0}
        empty={
          <EmptyState message={q ? `"${query}" 에 맞는 노트가 없어요.` : '첫 감상을 남겨보세요!'}>
            {!q && <Link to="/notes/new" className="btn btn-primary">새 노트 쓰기</Link>}
          </EmptyState>
        }
      >
        <NoteList notes={filtered} />
      </AsyncBoundary>
    </>
  )
}
