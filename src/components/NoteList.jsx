import NoteCard from './NoteCard'

export default function NoteList({ notes }) {
  return (
    <div className="grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
