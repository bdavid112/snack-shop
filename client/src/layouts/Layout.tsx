import { ReactNode } from 'react'
import { NavLink } from '@components/NavLink/NavLink'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#06B6D4] to-[#6366F1]">
      <header>
        <nav className="bg-white shadow-md h-14">
          <div className="relative h-full max-w-[1200px] mx-auto px-4 flex items-center">
            {/* Logo on the left */}
            <div className="z-10 w-fit">
              <NavLink
                className="font-[Praise] font-normal text-4xl tracking-tight text-[var(--zui-text-primary)]"
                href="/"
                label="Snack Shop"
              />
            </div>

            {/* Centered nav links */}
            <ul className="absolute flex items-center gap-4 -translate-x-1/2 left-1/2">
              <li>
                <NavLink href="/products" label="Snacks" />
              </li>
              <li>
                <NavLink href="/orders" label="Orders" />
              </li>
              <li>
                <NavLink href="/users" label="Users" />
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto mt-16">{children}</div>
      </main>

      <footer className="p-4 text-[var(--zui-text-inverted)] text-sm text-center opacity-70">
        <div className="max-w-[1200px] mx-auto px-4">
          &copy; {new Date().getFullYear()} Boros Dávid
        </div>
      </footer>
    </div>
  )
}
