import clsx from 'clsx'
import { ButtonProps } from './Button.types'

export const Button = ({
  variant = 'primary',
  size = 'md',
  shape = 'rectangle',
  disabled,
  children,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) => {
  const isIconOnly = !!icon && !children

  return (
    <button
      className={clsx(
        'zui-button',
        `zui-button--${variant}`,
        `zui-button--${size}`,
        `zui-button--${shape}`,
        { 'zui-button--icon-only': isIconOnly },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="zui-button__icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="zui-button__icon">{icon}</span>}
    </button>
  )
}
