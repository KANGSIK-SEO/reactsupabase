import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useNote } from '../hooks/useNote'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { notesApi } from '../api/notesApi'
import AsyncBoundary from '../components/AsyncBoundary'
import EmptyState from '../components/EmptyState'
import StarRating from '../components/StarRating'
import Button from '../components/Button'

const fmt = (iso) => new Date(iso).toLocaleString('ko-KR')

export default function NoteDetailPage() {
  const { id } = useParams() // 주소 /notes/:id 의 id
  const { note, loading, error, reload } = useNote(id)
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  useDocumentTitle(note?.title)

  const handleDelete = async () => {
    if (!window.confirm('이 노트를 삭제할까요?')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await notesApi.remove(id)
      navigate('/notes', { replace: true })
    } catch (e) {
      setDeleteError(e)
      setDeleting(false)
    }
  }

  return (
    <AsyncBoundary
      loading={loading}
      error={error}
      onRetry={reload}
      isEmpty={!note}
      empty={
        <EmptyState message="해당 노트를 찾을 수 없어요.">
          <Link to="/notes" className="btn btn-secondary">목록으로</Link>
        </EmptyState>
      }
    >
      {note && (
        <article className="card detail">
          <p><Link to="/notes" className="muted">← 목록으로</Link></p>
          <h1>{note.title}</h1>
          <p className="muted">
            {note.artist}
            {note.year ? ` · ${note.year}년` : ''}
          </p>
          <StarRating value={note.rating} />
          <p className="content">{note.content}</p>
          <p className="muted small">
            작성 {fmt(note.created_at)}
            {note.updated_at !== note.created_at && ` · 수정 ${fmt(note.updated_at)}`}
          </p>
          {deleteError && <p className="field-error">삭제 실패: {deleteError.message}</p>}
          <div className="actions">
            <Link to={`/notes/${note.id}/edit`} className="btn btn-secondary">수정</Link>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </article>
      )}
    </AsyncBoundary>
  )
}
