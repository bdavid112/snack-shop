/**
 * Renders a customizable input field with optional label and helper text.
 *
 * @param id - The unique identifier for the input element.
 * @param label - Optional label text to display above the input.
 * @param helperText - Optional helper text displayed below the input.
 * @param variant - Visual style of the input. Defaults to `'filled'`.
 * @param state - Visual state of the input (e.g., 'default', 'error'). Defaults to `'default'`.
 * @param size - Size of the input (e.g., 'sm', 'md', 'lg'). Defaults to `'md'`.
 * @param type - The input type attribute. Defaults to `'text'`.
 * @param disabled - Whether the input is disabled.
 * @param className - Additional class names to apply to the root element.
 * @param props - Additional props to spread onto the input element.
 * @returns A styled input component with optional label and helper text.
 */
import clsx from 'clsx'
import { InputProps } from './Input.types'

export const Input = ({
  id,
  label,
  helperText,
  variant = 'filled',
  state = 'default',
  size = 'md',
  type = 'text',
  disabled,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={clsx('zui-input', `zui-input--${variant}`, `zui-input--${size}`, className)}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={clsx('zui-input-field-wrapper', `zui-input-field-wrapper--${state}`)}>
        <input id={id} type={type} disabled={disabled} {...props} />
      </div>
      {helperText && (
        <span className={clsx('helper-text', `helper-text--${state}`)}>{helperText}</span>
      )}
    </div>
  )
}
