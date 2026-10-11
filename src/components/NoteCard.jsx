import { Link } from 'react-router-dom'
import StarRating from './StarRating'

export default function NoteCard({ note }) {
  return (
    <Link to={`/notes/${note.id}`} className="card note-card">
      <h3>{note.title}</h3>
      <p className="muted">
        {note.artist}
        {note.year ? ` · ${note.year}` : ''}
      </p>
      <StarRating value={note.rating} />
      <p className="excerpt">{note.content}</p>
    </Link>
  )
}
