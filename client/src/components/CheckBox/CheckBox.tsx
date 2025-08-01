import clsx from 'clsx'
import { CheckBoxProps } from './CheckBox.types'

export const CheckBox = ({ label, disabled, className, checked, ...rest }: CheckBoxProps) => {
  return (
    <label className={clsx('zui-check-box', className)}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        className="zui-check-box-input peer"
        {...rest}
      />
      <span className="zui-check-box-custom">
        <svg
          className="check-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {label && <span className="zui-check-box-label">{label}</span>}
    </label>
  )
}
