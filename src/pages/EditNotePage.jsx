import { Link, useNavigate, useParams } from 'react-router-dom'
import { notesApi } from '../api/notesApi'
import { useNote } from '../hooks/useNote'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import AsyncBoundary from '../components/AsyncBoundary'
import EmptyState from '../components/EmptyState'
import NoteForm from '../components/NoteForm'

export default function EditNotePage() {
  useDocumentTitle('노트 수정')
  const { id } = useParams()
  const { note, loading, error, reload } = useNote(id)
  const navigate = useNavigate()

  const handleUpdate = async (values) => {
    await notesApi.update(id, values)
    navigate(`/notes/${id}`, { replace: true })
  }

  return (
    <>
      <h1>노트 수정</h1>
      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={!note}
        empty={
          <EmptyState message="수정할 노트를 찾을 수 없어요.">
            <Link to="/notes" className="btn btn-secondary">목록으로</Link>
          </EmptyState>
        }
      >
        {/* 데이터가 다 온 다음에 폼을 그려야 초기값이 제대로 들어갑니다 */}
        {note && (
          <NoteForm
            initialValues={note}
            submitLabel="수정 완료"
            onSubmit={handleUpdate}
            onCancel={() => navigate(`/notes/${id}`)}
          />
        )}
      </AsyncBoundary>
    </>
  )
}
