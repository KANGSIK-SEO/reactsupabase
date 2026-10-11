import { useEffect } from 'react'

// 페이지마다 브라우저 탭 제목을 바꿔 주는 작은 훅
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · 명화 감상 노트` : '명화 감상 노트'
  }, [title])
}
