'use client'

import { useEffect, useRef, useState } from 'react'
import type { CalcResult } from '@/lib/calculator'

// ─── Count-up animation hook ──────────────────────────────────────────────────

function useCountUp(target: number, duration = 550): number {
  const [displayed, setDisplayed] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    cancelAnimationFrame(rafRef.current)
    const startTime = performance.now()

    function step(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setDisplayed(Math.round(from + (target - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return displayed
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function MonthsLabel({ months }: { months: number }) {
  if (months >= 9_999) return <span>Unable to pay off at minimum payments</span>
  const yrs = Math.floor(months / 12)
  const mos = months % 12
  if (yrs === 0) return <span>{mos}mo</span>
  if (mos === 0) return <span>{yrs}yr</span>
  return <span>{yrs}yr {mos}mo</span>
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ResultsPanelProps {
  result: CalcResult
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const animatedSavings = useCountUp(Math.max(0, Math.round(result.totalSavings)))

  const {
    totalBalance,
    totalCCInterest,
    loanTotalInterest,
    totalSavings,
    totalCCMonthlyPayment,
    loanMonthlyPayment,
    monthlySavings,
    maxCCMonths,
    loanTermMonths,
    loanApr,
    cards,
  } = result

  const barMax = Math.min(maxCCMonths, 360) // cap CC bar at 30 yrs for display
  const loanBarPct = Math.round((loanTermMonths / barMax) * 100)
  const ccBarPct = Math.min(100, Math.round((Math.min(maxCCMonths, 360) / barMax) * 100))

  // Edge case flags
  const tooSmall = totalBalance < 1_000
  const noSavings = totalSavings <= 0
  const highPayment = loanMonthlyPayment > totalCCMonthlyPayment * 1.5

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-24">
      {/* Total balance header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-lendzingo-green-light">
        <p className="text-xs font-sans font-semibold text-lendzingo-muted uppercase tracking-[0.12em]">
          Total Balance
        </p>
        <p className="font-serif text-2xl font-bold text-lendzingo-ink mt-0.5">
          {usd.format(totalBalance)}
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Edge case: balance too small */}
        {tooSmall && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-sans text-amber-800">
            Personal loans typically start at $1,000.
          </div>
        )}

        {/* Interest comparison */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-sans text-lendzingo-muted">Total interest at your current rates</span>
            <span className="font-sans font-semibold text-lendzingo-ink tabular-nums ml-2">
              {isFinite(totalCCInterest) ? usd.format(totalCCInterest) : '—'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-sans text-lendzingo-muted">
              Total interest at {loanApr}% APR
            </span>
            <span className="font-sans font-semibold text-lendzingo-green tabular-nums ml-2">
              {usd.format(loanTotalInterest)}
            </span>
          </div>
        </div>

        {/* Hero savings number */}
        <div className="bg-lendzingo-green-light rounded-xl px-5 py-5 text-center">
          <p className="text-xs font-sans font-semibold text-lendzingo-muted uppercase tracking-[0.12em] mb-1">
            Your Estimated Total Savings
          </p>
          <p className="font-serif font-bold text-lendzingo-green leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)' }}>
            {noSavings ? '—' : `$${animatedSavings.toLocaleString('en-US')}`}
          </p>
        </div>

        {/* Edge case messages */}
        {noSavings && !tooSmall && (
          <p className="text-sm font-sans text-lendzingo-muted text-center">
            {loanTermMonths > 24
              ? 'Try a shorter loan term — less time means less interest paid on the loan.'
              : "Great news — your current payoff plan is already beating a personal loan. Keep it up!"}
          </p>
        )}
        {highPayment && !noSavings && (
          <p className="text-sm font-sans text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            This term means a higher monthly payment than you&rsquo;re paying now. Try 48 or 60 months if you need more breathing room.
          </p>
        )}

        {/* Monthly payment comparison */}
        {!tooSmall && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              <div className="px-4 py-3">
                <p className="text-xs font-sans text-lendzingo-muted mb-0.5">Your payments now</p>
                <p className="font-sans font-bold text-lendzingo-ink tabular-nums">
                  {usd.format(totalCCMonthlyPayment)}<span className="text-lendzingo-muted font-normal text-xs">/mo</span>
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-sans text-lendzingo-muted mb-0.5">Personal loan payment</p>
                <p className="font-sans font-bold text-lendzingo-green tabular-nums">
                  {usd.format(loanMonthlyPayment)}<span className="text-lendzingo-muted font-normal text-xs">/mo</span>
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 bg-lendzingo-green-light">
              <div className="flex justify-between items-baseline">
                <p className="text-xs font-sans font-semibold text-lendzingo-ink">Monthly savings</p>
                <p className="font-sans font-bold text-lendzingo-green tabular-nums">
                  {monthlySavings > 0 ? usd.format(monthlySavings) : '—'}<span className="text-lendzingo-muted font-normal text-xs">/mo</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payoff timeline */}
        {!tooSmall && (
          <div>
            <p className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-[0.12em] mb-3">
              Payoff Timeline
            </p>
            <div className="space-y-2.5">
              {/* CC bar */}
              <div>
                <div className="flex justify-between text-xs font-sans text-lendzingo-muted mb-1">
                  <span>At current rates (min. payments)</span>
                  <span className="font-semibold text-lendzingo-ink tabular-nums">
                    <MonthsLabel months={maxCCMonths} />
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lendzingo-muted/40 rounded-full"
                    style={{ width: `${ccBarPct}%` }}
                  />
                </div>
              </div>
              {/* Loan bar */}
              <div>
                <div className="flex justify-between text-xs font-sans text-lendzingo-muted mb-1">
                  <span>With a personal loan</span>
                  <span className="font-semibold text-lendzingo-green tabular-nums">
                    <MonthsLabel months={loanTermMonths} />
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lendzingo-green rounded-full transition-all duration-500"
                    style={{ width: `${loanBarPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Per-card breakdown (2+ cards) */}
        {cards.length >= 2 && (
          <div>
            <button
              onClick={() => setBreakdownOpen((o) => !o)}
              className="text-xs font-sans text-lendzingo-green hover:text-lendzingo-green-dark font-semibold flex items-center gap-1"
            >
              <span>{breakdownOpen ? '▲' : '▼'}</span>
              {breakdownOpen ? 'Hide' : 'See'} breakdown by card
            </button>
            {breakdownOpen && (
              <div className="mt-3 space-y-2">
                {cards.map((card) => (
                  <div key={card.id} className="flex justify-between text-sm font-sans py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-lendzingo-muted">{card.name}</span>
                    <span className="text-lendzingo-ink font-semibold tabular-nums">
                      {usd.format(card.balance)} · {card.apr}% APR
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
