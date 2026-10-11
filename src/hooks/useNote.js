import { useCallback, useEffect, useState } from 'react'
import { notesApi } from '../api/notesApi'

// 노트 "한 개"를 가져오는 커스텀 훅. id 가 바뀌면 다시 요청합니다.
export function useNote(id) {
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setNote(await notesApi.get(id))
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [id])

  // 의존성 [load] = 사실상 [id] → 주소의 :id 가 바뀔 때마다 다시 실행
  useEffect(() => {
    load()
  }, [load])

  return { note, loading, error, reload: load }
}
