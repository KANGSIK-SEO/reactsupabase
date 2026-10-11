import { useCallback, useEffect, useState } from 'react'
import { notesApi } from '../api/notesApi'

// 노트 "목록"을 가져오는 커스텀 훅.
// 화면(컴포넌트)은 notes / loading / error 세 가지 상태만 보면 됩니다.
export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setNotes(await notesApi.list())
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  // 의존성 [load] → 컴포넌트가 처음 화면에 나타날 때 한 번 실행
  useEffect(() => {
    load()
  }, [load])

  return { notes, loading, error, reload: load }
}
