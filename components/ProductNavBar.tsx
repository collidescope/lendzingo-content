'use client'

import { useEffect, useRef, useState } from 'react'

export interface NavItem {
  id: string
  label: string
}

const defaultNavItems: NavItem[] = [
  { id: 'heloc', label: 'HELOC' },
  { id: 'home-equity-loan', label: 'Home Equity Loan' },
  { id: 'cash-out-refi', label: 'Cash-Out Refinance' },
  { id: 'personal-loan', label: 'Personal Loan' },
  { id: 'debt-relief', label: 'Debt Relief' },
]

interface ProductNavBarProps {
  items?: NavItem[]
}

export default function ProductNavBar({ items = defaultNavItems }: ProductNavBarProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id)
            }
          })
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm"
      aria-label="Product sections"
    >
      <div
        ref={navRef}
        className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto py-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`flex-shrink-0 text-sm font-sans px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeId === id
                ? 'border-lendzingo-green text-lendzingo-green font-semibold'
                : 'border-transparent text-lendzingo-muted hover:text-lendzingo-ink hover:border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
