'use client'

import Link from 'next/link'
import { ArrowLeft, Scissors } from 'lucide-react'
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
  slate: 'bg-slate-900',
  cyan: 'bg-cyan-700',
  fuchsia: 'bg-fuchsia-700',
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
    <main className="min-h-screen bg-transparent text-slate-900">
      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-slate-300 bg-[#fcfbf8] px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-[6px] text-white',
                  accentMap[accent],
                )}
              >
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <p className="display-font text-lg font-semibold tracking-tight text-slate-900">
                  Glamour Studio
                </p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {title}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href={navHref}>{navLabel}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/chat">AI Chat</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/staff">Staff</Link>
              </Button>
            </div>

            <Button className="px-4" asChild>
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="rounded-[8px] border border-slate-300 bg-[#fcfbf8] p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
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

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</section>
      </div>
    </main>
  )
}
