import clsx from 'clsx'

import { TabProps } from './Tab.types'

export function Tab({
  size = 'sm',
  active = false,
  className,
  disabled,
  variant,
  children,
  onClick,
}: TabProps) {
  return (
    <button
      className={clsx(
        'zui-tab',
        `zui-tab--${variant}`,
        `zui-tab--${size}`,
        { 'zui-tab--active': active },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
