'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { calculate, calcMinPayment, effectiveLoanApr, LOAN_APR, LOAN_TERMS, CREDIT_SCORE_TIERS } from '@/lib/calculator'
import type { CardInput, LoanTerm } from '@/lib/calculator'
import CreditCardRow from './CreditCardRow'
import ResultsPanel from './ResultsPanel'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

let nextId = 1
function makeCard(name: string, balance: number, apr: number, monthlyPayment?: number): CardInput {
  return { id: String(nextId++), name, balance, apr, monthlyPayment: monthlyPayment ?? calcMinPayment(balance, apr) }
}

const DEFAULT_CARDS: CardInput[] = [makeCard('Card 1', 10_000, 24, 305)]
const DEFAULT_TERM: LoanTerm = 36

export default function CalculatorForm() {
  const [cards, setCards] = useState<CardInput[]>(DEFAULT_CARDS)
  const [loanTerm, setLoanTerm] = useState<LoanTerm>(DEFAULT_TERM)
  const [creditTierIdx, setCreditTierIdx] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)

  const loanApr = effectiveLoanApr(CREDIT_SCORE_TIERS[creditTierIdx])
  const result = calculate(cards, loanTerm, loanApr)
  const canAddCard = cards.length < 5

  function updateCard(updated: CardInput) {
    setCards((cs) => cs.map((c) => (c.id === updated.id ? updated : c)))
  }

  function removeCard(id: string) {
    setCards((cs) => cs.filter((c) => c.id !== id))
  }

  function addCard() {
    const n = cards.length + 1
    setCards((cs) => [...cs, makeCard(`Card ${n}`, 5_000, 24)])
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Left column: Inputs ─────────────────────────────────── */}
        <div>
          {/* Card rows */}
          <div className="space-y-4">
            {cards.map((card) => (
              <CreditCardRow
                key={card.id}
                card={card}
                canRemove={cards.length > 1}
                onChange={updateCard}
                onRemove={() => removeCard(card.id)}
              />
            ))}
          </div>

          {/* Add card */}
          {canAddCard && (
            <button
              onClick={addCard}
              className="mt-4 text-sm font-sans font-semibold text-lendzingo-green hover:text-lendzingo-green-dark flex items-center gap-1.5 transition-colors"
            >
              <span className="text-base leading-none">+</span> Add Another Card
            </button>
          )}

          {/* Loan term selector */}
          <div className="mt-8">
            <p className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-[0.12em] mb-3">
              Personal Loan Term
            </p>
            <div className="grid grid-cols-4 gap-2">
              {LOAN_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-colors ${
                    loanTerm === term
                      ? 'bg-lendzingo-green text-white'
                      : 'bg-gray-100 text-lendzingo-muted hover:bg-gray-200'
                  }`}
                >
                  {term}mo
                </button>
              ))}
            </div>
          </div>

          {/* Credit score selector */}
          <div className="mt-6">
            <p className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-[0.12em] mb-3">
              Credit Score
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CREDIT_SCORE_TIERS.map((tier, i) => (
                <button
                  key={tier.label}
                  onClick={() => setCreditTierIdx(i)}
                  className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-colors ${
                    creditTierIdx === i
                      ? 'bg-lendzingo-green text-white'
                      : 'bg-gray-100 text-lendzingo-muted hover:bg-gray-200'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-sans text-lendzingo-muted mt-2">
              Estimated rate: {loanApr}% APR. Higher scores qualify for lower rates.
            </p>
          </div>
        </div>

        {/* ── Right column: Results ────────────────────────────────── */}
        <div ref={resultsRef}>
          <ResultsPanel result={result} />
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <div className="mt-12 bg-lendzingo-green-light border border-lendzingo-green/20 rounded-2xl px-8 py-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-lendzingo-ink mb-3">
          Ready to Start Saving?
        </h2>
        <p className="font-sans text-base text-lendzingo-ink mb-6 max-w-lg mx-auto leading-relaxed">
          myPersonalLoanCompanion can match you with a personal loan as low as {LOAN_APR}% APR, and
          checking your rate takes less than two minutes. No impact to your credit score.
        </p>
        <Link
          href="https://www.mypersonalloancompanion.com/offer/personal-loan?tid=011"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-lendzingo-green hover:bg-lendzingo-green-dark text-white font-sans font-semibold text-base px-8 py-4 rounded-lg transition-colors duration-150"
        >
          Check My Rate →
        </Link>
        <p className="text-xs font-sans text-lendzingo-muted mt-4 max-w-sm mx-auto leading-relaxed">
          Rates shown are for illustrative purposes only. Your actual rate will depend on your credit
          profile and other factors. Rates start at {LOAN_APR}% APR.
        </p>
      </div>

      {/* Advertising disclosure */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs font-sans text-lendzingo-muted leading-relaxed">
          Advertising Disclosure: Lendzingo is an advertising-supported comparison platform. We may
          receive compensation when you click on links to products featured on this site. Rates shown
          are estimates based on advertised APR and are for illustrative purposes only.
        </p>
      </div>

      {/* ── Mobile sticky savings bar ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <button
          onClick={() =>
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="w-full flex items-center justify-between px-5 py-3"
        >
          <span className="text-sm font-sans text-lendzingo-muted">Estimated savings</span>
          <span className="font-serif font-bold text-lendzingo-green text-xl tabular-nums">
            {result.totalSavings > 0 ? usd.format(Math.round(result.totalSavings)) : '—'}
          </span>
        </button>
      </div>
    </>
  )
}
