import { ReactNode } from 'react'
import { NavLink } from '@components/NavLink/NavLink'
import { Button } from '@components/Button'
import { api } from '@api/api'
import { HiOutlineShoppingCart, HiOutlineLogout } from 'react-icons/hi'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#06B6D4] to-[#6366F1]">
      <header>
        <nav className="bg-white shadow-md h-14">
          <div className="relative h-full max-w-[1200px] mx-auto px-4 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="z-10 w-fit">
              <NavLink
                className="font-[Praise] font-normal text-4xl tracking-tight text-[var(--zui-text-primary)]"
                href="/"
                label="Snack Shop"
              />
            </div>

            {/* Center: Nav Links */}
            <ul className="absolute flex items-center gap-4 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
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

            {/* Right: Cart Icon & Logout */}
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                aria-label="Cart"
                shape="pill"
                onClick={() => {
                  window.location.href = '/cart'
                }}
                className="p-2"
              >
                <HiOutlineShoppingCart className="w-4.5 h-4.5" />
              </Button>

              <Button
                size="sm"
                shape="pill"
                variant="ghost"
                onClick={() => {
                  api.post('/logout')
                }}
                className="flex items-center gap-1 p-2"
              >
                <HiOutlineLogout className="w-4.5 h-4.5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto mt-16 px-4">{children}</div>
      </main>

      <footer className="p-4 text-[var(--zui-text-inverted)] text-sm text-center opacity-70">
        <div className="max-w-[1200px] mx-auto px-4">
          &copy; {new Date().getFullYear()} Boros Dávid
        </div>
      </footer>
    </div>
  )
}
