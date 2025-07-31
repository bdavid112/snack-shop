import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { NavLinkProps } from './NavLink.types'
import { useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'

export function NavLink({
  href,
  label,
  icon,
  variant = 'simple',
  isActive,
  className,
  children,
}: NavLinkProps) {
  const location = useLocation()
  const active = isActive ?? location.pathname === href

  const labelRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="zui-navlink__wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setTimeout(() => setIsHovered(false), 200)
      }}
    >
      <Link
        to={href}
        className={clsx(
          'zui-navlink',
          `zui-navlink--${variant}`,
          { 'zui-navlink--active': active },
          className
        )}
      >
        {icon && <span className="zui-navlink__icon">{icon}</span>}
        <span ref={labelRef}>{label}</span>
        {variant === 'expandable' && (
          <span className="zui-navlink__expand_icon">
            <HiChevronDown />
          </span>
        )}
      </Link>
      {variant === 'expandable' && (
        <div
          className={clsx('zui-navlink__expanded_menu', {
            'zui-navlink--expandable_hovered': isHovered,
          })}
        >
          {children}
        </div>
      )}
    </div>
  )
}
