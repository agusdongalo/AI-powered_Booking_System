'use client'

import Link from 'next/link'
import { ArrowLeft, CalendarDays, MessageCircle, Scissors } from 'lucide-react'
import { Button } from './button'
import { cn } from './utils'

type ShellProps = {
  title: string
  description?: string
  backHref?: string
  navHref?: string
  navLabel?: string
  children: React.ReactNode
  accent?: 'slate' | 'cyan' | 'fuchsia'
}

const accentMap = {
  slate: 'from-slate-900 to-slate-700',
  cyan: 'from-cyan-700 to-slate-900',
  fuchsia: 'from-fuchsia-700 to-slate-900',
}

export function SiteShell({
  title,
  description,
  backHref = '/',
  navHref = '/',
  navLabel = 'Home',
  children,
  accent = 'slate',
}: ShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-12 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,121,249,0.1),transparent_28%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.08),transparent_30%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/75 px-5 py-4 text-slate-900 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl text-white ring-1 ring-slate-900/5 bg-gradient-to-br', accentMap[accent])}>
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <p className="display-font text-lg font-semibold tracking-tight text-slate-900">
                  Glamour Studio
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {title}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900" asChild>
                <Link href={navHref}>{navLabel}</Link>
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900" asChild>
                <Link href="/chat">AI Chat</Link>
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900" asChild>
                <Link href="/staff">Staff</Link>
              </Button>
            </div>

            <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white/75 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-8">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-700/70">
                {navLabel}
              </p>
              <h1 className="display-font mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {children}
        </section>
      </div>
    </main>
  )
}
