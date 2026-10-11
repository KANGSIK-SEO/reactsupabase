// 라벨 + 입력칸 + 에러 메시지를 한 묶음으로
export default function FormField({ label, error, required, children }) {
  return (
    <label className="field">
      <span className="field-label">
        {label} {required && <span className="required">*</span>}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
