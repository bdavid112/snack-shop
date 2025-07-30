import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#06B6D4] to-[#6366F1]">
      <header className=""></header>

      <main className="flex-1 p-4">{children}</main>

      <footer className="p-4 text-[var(--zui-text-inverted)] text-sm text-center opacity-70">
        &copy; {new Date().getFullYear()} Boros Dávid
      </footer>
    </div>
  )
}
