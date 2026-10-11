import { Link } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import AsyncBoundary from '../components/AsyncBoundary'
import EmptyState from '../components/EmptyState'
import NoteList from '../components/NoteList'

export default function HomePage() {
  useDocumentTitle('홈')
  const { notes, loading, error, reload } = useNotes()
  const recent = notes.slice(0, 3)

  return (
    <>
      <section className="hero">
        <h1>그림 앞에서 느낀 것을 기록하세요</h1>
        <p className="muted">작품, 작가, 별점, 감상을 남기고 언제든 다시 꺼내 보는 나만의 미술 노트.</p>
        <div className="actions center">
          <Link to="/notes/new" className="btn btn-primary">새 감상 쓰기</Link>
          <Link to="/notes" className="btn btn-secondary">전체 노트 보기</Link>
        </div>
      </section>

      <h2>최근 감상</h2>
      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={recent.length === 0}
        empty={<EmptyState message="아직 작성한 감상이 없어요." />}
      >
        <NoteList notes={recent} />
      </AsyncBoundary>
    </>
  )
}
