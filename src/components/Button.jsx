// 모든 버튼의 모양을 통일하는 공통 컴포넌트. variant: primary | secondary | danger
export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />
}
