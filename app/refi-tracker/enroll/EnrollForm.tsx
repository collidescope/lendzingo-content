'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Params {
  balance?: string
  payment?: string
  rate?: string
  startMonth?: string
  startYear?: string
  originalTerm?: string
  newTerm?: string
  targetSavings?: string
  creditScore?: string
}

interface Props {
  params: Params
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatBalance(val?: string) {
  if (!val) return '—'
  const n = parseFloat(val.replace(/,/g, ''))
  return isNaN(n) ? '—' : usd.format(n)
}

function termLabel(val?: string) {
  return val === '15' ? '15-year fixed' : '30-year fixed'
}

function hasParams(p: Params) {
  return !!(p.balance && p.rate && p.payment)
}

// ─── Small UI ─────────────────────────────────────────────────────────────────

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-sans font-semibold text-lendzingo-ink mb-1">
      {children}
    </label>
  )
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs font-sans text-red-500 mt-1">{msg}</p>
}

function inputClass(hasError?: boolean) {
  return [
    'w-full border rounded-lg px-4 py-3 font-sans text-base text-lendzingo-ink bg-white',
    'focus:outline-none focus:ring-2 focus:ring-lendzingo-green focus:border-transparent',
    'transition-colors duration-150',
    hasError ? 'border-red-400' : 'border-gray-200',
  ].join(' ')
}

// ─── Loan Summary Card ────────────────────────────────────────────────────────

function LoanSummary({ params }: { params: Params }) {
  const rows = [
    { label: 'Current balance', value: formatBalance(params.balance) },
    { label: 'Current rate', value: params.rate ? `${params.rate}%` : '—' },
    { label: 'Monthly payment', value: formatBalance(params.payment) },
    { label: 'Target monthly savings', value: formatBalance(params.targetSavings) },
    { label: 'New loan term', value: termLabel(params.newTerm) },
    { label: 'Credit score', value: params.creditScore ?? '—' },
  ]

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mb-8">
      <div className="px-5 py-3 border-b border-gray-200">
        <p className="text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em]">
          Your Loan Details
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center px-5 py-3">
            <span className="text-sm font-sans text-lendzingo-muted">{label}</span>
            <span className="text-sm font-sans font-semibold text-lendzingo-ink">{value}</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-gray-200">
        <Link
          href={`/refi-tracker`}
          className="text-xs font-sans text-lendzingo-green hover:text-lendzingo-green-dark underline"
        >
          ← Edit my numbers
        </Link>
      </div>
    </div>
  )
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessScreen({ firstName }: { firstName: string }) {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const monthName = nextMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-lendzingo-green-light border border-lendzingo-green/20 flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-lendzingo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-bold text-lendzingo-ink mb-3">
        {firstName ? `You're in, ${firstName}.` : "You're in."}
      </h2>
      <p className="font-sans text-[1rem] leading-[1.8] text-lendzingo-muted mb-2">
        We&rsquo;ll send your first rate update in <span className="font-semibold text-lendzingo-ink">{monthName}</span>.
      </p>
      <p className="font-sans text-sm text-lendzingo-muted mb-8">
        Each month you&rsquo;ll get a quick summary showing where rates stand and how close you are
        to your savings target. No spam, unsubscribe anytime.
      </p>
      <Link
        href="/refi-tracker"
        className="inline-block border border-lendzingo-green text-lendzingo-green hover:bg-lendzingo-green/5 font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-150"
      >
        ← Back to Calculator
      </Link>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EnrollForm({ params }: Props) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(false)

  const fromCalculator = hasParams(params)

  function validateEmail(val: string) {
    if (!val) return 'Email address is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address'
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setEmailError(err); return }

    setSubmitting(true)
    setServerError(false)

    try {
      const res = await fetch('/api/refi-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim() || null,
          email: email.trim().toLowerCase(),
          loanBalance: params.balance ? parseFloat(params.balance.replace(/,/g, '')) : null,
          currentRate: params.rate ? parseFloat(params.rate) : null,
          monthlyPayment: params.payment ? parseFloat(params.payment.replace(/,/g, '')) : null,
          loanStartMonth: params.startMonth ? parseInt(params.startMonth) : null,
          loanStartYear: params.startYear ? parseInt(params.startYear) : null,
          originalTerm: params.originalTerm ? parseInt(params.originalTerm) : null,
          newTerm: params.newTerm ? parseInt(params.newTerm) : null,
          targetSavings: params.targetSavings ? parseFloat(params.targetSavings.replace(/,/g, '')) : null,
          creditScore: params.creditScore ?? null,
        }),
      })

      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
    } catch {
      setServerError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <SuccessScreen firstName={firstName.trim()} />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      {/* Heading */}
      <div className="mb-8">
        <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
          Monthly Rate Tracking
        </span>
        <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-lendzingo-ink leading-tight mb-4">
          We&rsquo;ll watch rates for you every month.
        </h1>
        <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted">
          Enter your email and we&rsquo;ll send you a monthly update showing exactly where rates
          stand and how close you are to your savings target.
        </p>
      </div>

      {/* Loan summary — only shown if arriving from calculator */}
      {fromCalculator && <LoanSummary params={params} />}

      {/* No-params fallback */}
      {!fromCalculator && (
        <div className="bg-lendzingo-green-light border border-lendzingo-green/20 rounded-xl px-5 py-4 mb-8">
          <p className="text-sm font-sans text-lendzingo-ink leading-relaxed">
            <span className="font-semibold">Haven&rsquo;t run your numbers yet?</span>{' '}
            <Link href="/refi-tracker" className="text-lendzingo-green underline hover:text-lendzingo-green-dark">
              Go back to the calculator
            </Link>{' '}
            first to see where you stand, then sign up for tracking from there.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Label htmlFor="firstName">First name <span className="text-lendzingo-muted font-normal">(optional)</span></Label>
          <input
            id="firstName"
            type="text"
            placeholder="Alex"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass()}
          />
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
            className={inputClass(!!emailError)}
          />
          <ErrorMsg msg={emailError} />
        </div>

        {serverError && (
          <p className="text-sm font-sans text-red-500">
            Something went wrong. Please try again in a moment.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-lendzingo-green hover:bg-lendzingo-green-dark disabled:opacity-60 text-white font-sans font-semibold text-base px-6 py-4 rounded-lg transition-colors duration-150"
        >
          {submitting ? 'Setting up your tracker…' : 'Start Tracking My Rate →'}
        </button>

        <p className="text-xs font-sans text-lendzingo-muted text-center leading-relaxed">
          One email per month. No spam, ever. Unsubscribe with one click at any time.
        </p>
      </form>
    </div>
  )
}
