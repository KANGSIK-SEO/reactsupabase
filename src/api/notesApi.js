// 데이터를 읽고 쓰는 코드는 전부 이 파일에만 있습니다.
// 컴포넌트는 "어디에 저장되는지" 몰라도 되도록 분리했습니다.
import { supabase, isDemoMode } from './supabaseClient'

const TABLE = 'notes'

// ---------- Supabase (원격 DB) ----------
const remote = {
  async list() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async get(id) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data // 없으면 null
  },
  async create(note) {
    const { data, error } = await supabase.from(TABLE).insert(note).select().single()
    if (error) throw error
    return data
  },
  async update(id, note) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...note, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },
}

// ---------- 데모 모드 (.env 없을 때, 브라우저 localStorage) ----------
const KEY = 'art-notes-demo'
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms)) // 로딩 상태를 눈으로 보기 위한 지연

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved)) return saved
  } catch {
    /* 저장소를 못 읽으면 기본 데이터 사용 */
  }
  const now = new Date().toISOString()
  return [
    { id: 1, title: '별이 빛나는 밤', artist: '빈센트 반 고흐', year: 1889, rating: 5,
      content: '소용돌이치는 하늘이 마음속 불안과 설렘을 동시에 보여주는 것 같다.', created_at: now, updated_at: now },
  ]
}
function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* 저장 실패는 무시 */
  }
}

const demo = {
  async list() {
    await wait()
    return read().sort((a, b) => b.created_at.localeCompare(a.created_at))
  },
  async get(id) {
    await wait()
    return read().find((n) => String(n.id) === String(id)) ?? null
  },
  async create(note) {
    await wait()
    const list = read()
    const now = new Date().toISOString()
    const created = { ...note, id: Math.max(0, ...list.map((n) => n.id)) + 1, created_at: now, updated_at: now }
    write([...list, created])
    return created
  },
  async update(id, note) {
    await wait()
    const list = read()
    const idx = list.findIndex((n) => String(n.id) === String(id))
    if (idx === -1) throw new Error('노트를 찾을 수 없습니다.')
    list[idx] = { ...list[idx], ...note, updated_at: new Date().toISOString() }
    write(list)
    return list[idx]
  },
  async remove(id) {
    await wait()
    write(read().filter((n) => String(n.id) !== String(id)))
  },
}

export const notesApi = isDemoMode ? demo : remote
