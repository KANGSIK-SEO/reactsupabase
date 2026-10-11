import { useNavigate } from 'react-router-dom'
import { notesApi } from '../api/notesApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NoteForm from '../components/NoteForm'

export default function NewNotePage() {
  useDocumentTitle('새 노트')
  const navigate = useNavigate()

  const handleCreate = async (values) => {
    const created = await notesApi.create(values)
    navigate(`/notes/${created.id}`, { replace: true })
  }

  return (
    <>
      <h1>새 감상 노트</h1>
      <NoteForm submitLabel="등록" onSubmit={handleCreate} onCancel={() => navigate(-1)} />
    </>
  )
}
