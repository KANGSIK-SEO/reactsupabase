import { useState } from 'react'
import FormField from './FormField'
import StarRating from './StarRating'
import Button from './Button'

const EMPTY = { title: '', artist: '', year: '', rating: 0, content: '' }

// 유효성 검사 규칙. 에러가 있으면 { 필드명: 메시지 } 를 돌려줍니다.
export function validate(v) {
  const errors = {}
  if (!v.title.trim()) errors.title = '작품 제목을 입력하세요.'
  if (!v.artist.trim()) errors.artist = '작가 이름을 입력하세요.'
  if (v.year !== '' && (!/^\d+$/.test(String(v.year)) || v.year < 1 || v.year > new Date().getFullYear()))
    errors.year = '올바른 연도를 숫자로 입력하세요.'
  if (!v.rating) errors.rating = '별점을 골라주세요.'
  if (v.content.trim().length < 10) errors.content = '감상은 10자 이상 적어주세요.'
  return errors
}

// 등록/수정 화면이 같이 쓰는 폼. 입력값 상태는 폼 안에서만 필요하므로 여기에 둡니다.
// 저장(onSubmit)은 부모 페이지가 결정합니다. (새로 만들기 vs 수정하기)
export default function NoteForm({ initialValues, submitLabel = '저장', onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    year: initialValues?.year ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const change = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit({
        title: values.title.trim(),
        artist: values.artist.trim(),
        year: values.year === '' ? null : Number(values.year),
        rating: values.rating,
        content: values.content.trim(),
      })
    } catch (err) {
      setSubmitError(err)
      setSubmitting(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <FormField label="작품 제목" required error={errors.title}>
        <input className="input" value={values.title} onChange={(e) => change('title', e.target.value)} disabled={submitting} />
      </FormField>
      <FormField label="작가" required error={errors.artist}>
        <input className="input" value={values.artist} onChange={(e) => change('artist', e.target.value)} disabled={submitting} />
      </FormField>
      <FormField label="제작 연도" error={errors.year}>
        <input className="input" inputMode="numeric" value={values.year} onChange={(e) => change('year', e.target.value)} disabled={submitting} />
      </FormField>
      <FormField label="별점" required error={errors.rating}>
        <StarRating value={values.rating} onChange={submitting ? undefined : (n) => change('rating', n)} />
      </FormField>
      <FormField label="감상" required error={errors.content}>
        <textarea className="input" rows={6} value={values.content} onChange={(e) => change('content', e.target.value)} disabled={submitting} />
      </FormField>

      {submitError && <p className="field-error">저장 실패: {submitError.message}</p>}

      <div className="actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
