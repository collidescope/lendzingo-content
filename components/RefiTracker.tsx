'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { calculateSnapshot, CREDIT_SCORE_TIERS } from '@/lib/refi-calculator'
import type { RefiSnapshot } from '@/lib/refi-calculator'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormValues {
  balance: string
  monthlyPayment: string
  rate: string
  startMonth: string
  startYear: string
  originalTerm: string
  newTerm: string
  targetSavings: string
  creditScore: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

// ─── Helpers ─────────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const pct = (n: number) => `${n.toFixed(2)}%`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

function parse(val: string) {
  return parseFloat(val.replace(/,/g, ''))
}

function formatWithCommas(val: string): string {
  const digits = val.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toLocaleString('en-US')
}

function validate(f: FormValues): FormErrors {
  const e: FormErrors = {}
  if (!f.balance || isNaN(parse(f.balance)) || parse(f.balance) <= 0)
    e.balance = 'Enter a valid loan balance'
  if (!f.monthlyPayment || isNaN(parse(f.monthlyPayment)) || parse(f.monthlyPayment) <= 0)
    e.monthlyPayment = 'Enter your current monthly payment (principal + interest)'
  if (!f.rate || isNaN(parseFloat(f.rate)) || parseFloat(f.rate) <= 0 || parseFloat(f.rate) > 30)
    e.rate = 'Enter a valid interest rate (e.g. 6.75)'
  if (!f.startMonth) e.startMonth = 'Select a month'
  if (!f.startYear) e.startYear = 'Select a year'
  if (!f.targetSavings || isNaN(parse(f.targetSavings)) || parse(f.targetSavings) <= 0)
    e.targetSavings = 'Enter the amount you want to save each month'
  return e
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-sans font-semibold text-lendzingo-ink mb-1">
      {children}
    </label>
  )
}

function Helper({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-sans text-lendzingo-muted mt-1">{children}</p>
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

function selectClass(hasError?: boolean) {
  return inputClass(hasError) + ' appearance-none'
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans text-xs font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-5 mt-10 first:mt-0">
      {children}
    </h2>
  )
}

// ─── Snapshot result card ─────────────────────────────────────────────────────

function SnapshotCard({ result, onEnroll }: { result: RefiSnapshot; onEnroll: () => void }) {
  const saving = result.monthlySavings
  const positive = saving > 0
  const remaining = result.targetMonthlySavings - saving

  return (
    <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-lendzingo-green px-6 py-4">
        <p className="font-sans text-xs font-semibold text-white/80 uppercase tracking-[0.15em] mb-0.5">
          Your Refi Snapshot
        </p>
        <p className="font-serif text-xl font-bold text-white leading-snug">
          {result.goalReached
            ? "You've hit your savings goal."
            : positive
            ? `You're ${usd.format(Math.max(0, remaining))}/mo away from your goal.`
            : "Refinancing today wouldn't lower your payment yet."}
        </p>
      </div>

      {/* Numbers row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Current Payment', value: usd.format(result.currentMonthlyPayment) },
          { label: 'New Payment Today', value: usd.format(result.newMonthlyPayment) },
          {
            label: positive ? 'Monthly Savings' : 'Monthly Difference',
            value: positive ? usd.format(saving) : `-${usd.format(Math.abs(saving))}`,
            highlight: positive,
          },
        ].map((col) => (
          <div key={col.label} className="px-5 py-5 text-center">
            <p className="text-xs font-sans text-lendzingo-muted mb-1">{col.label}</p>
            <p className={`font-serif text-xl font-bold ${col.highlight ? 'text-lendzingo-green' : 'text-lendzingo-ink'}`}>
              {col.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress section */}
      <div className="px-6 py-5">
        {positive ? (
          <>
            <div className="flex justify-between text-xs font-sans text-lendzingo-muted mb-2">
              <span>Progress toward {usd.format(result.targetMonthlySavings)}/mo goal</span>
              <span className="font-semibold text-lendzingo-ink">
                {Math.round(result.progressPercent)}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-lendzingo-green rounded-full transition-all duration-700 ease-out"
                style={{ width: `${result.progressPercent}%` }}
              />
            </div>
            {result.goalReached ? (
              <p className="text-sm font-sans text-lendzingo-green font-semibold mt-2">
                Your goal is within reach. Connect with a lender to get started.
              </p>
            ) : (
              <p className="text-sm font-sans text-lendzingo-muted mt-2">
                Rates need to drop a bit more before you hit your target.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm font-sans text-lendzingo-muted">
            At today&rsquo;s rates, a new loan would cost more than your current payment. This
            usually means your existing rate is already competitive.
          </p>
        )}

        {/* Monthly tracking callout — shown when goal not yet reached */}
        {!result.goalReached && (
          <div className="mt-4 bg-lendzingo-green-light border border-lendzingo-green/20 rounded-lg px-4 py-3">
            <p className="text-sm font-sans text-lendzingo-ink leading-relaxed">
              <span className="font-semibold">Want us to keep an eye on this for you?</span> Sign up
              for monthly progress updates and we&rsquo;ll email you a report each month letting
              you know how close you are to your target.
            </p>
          </div>
        )}

        {/* Rate footnote */}
        <p className="text-xs font-sans text-lendzingo-muted mt-4">
          Based on a {pct(result.adjustedRate)} rate
          {result.usingFallbackRate ? ' (estimated)' : ` (Freddie Mac PMMS ${pct(result.pmmsRate)}`}
          {!result.usingFallbackRate && result.weekOf ? `, week of ${result.weekOf})` : ''}
          {result.usingFallbackRate ? '' : ''}, adjusted for your credit score.
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        {!result.goalReached && (
          <button
            onClick={onEnroll}
            className="block w-full text-center bg-lendzingo-green hover:bg-lendzingo-green-dark text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-150"
          >
            Track My Monthly Progress →
          </button>
        )}
        <Link
          href="https://www.myreficompanion.com/offer/refinance"
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-150 ${
            result.goalReached
              ? 'bg-lendzingo-green hover:bg-lendzingo-green-dark text-white'
              : 'border border-lendzingo-green text-lendzingo-green hover:bg-lendzingo-green/5'
          }`}
        >
          {result.goalReached ? 'Connect With a Lender →' : 'Explore Refinancing Options →'}
        </Link>
      </div>
    </div>
  )
}

// ─── Inline enrollment form ───────────────────────────────────────────────────

function EnrollPanel({
  result,
  onSubmit,
  firstName, setFirstName,
  email, setEmail,
  emailError, setEmailError,
  submitting,
  submitted,
  serverError,
}: {
  result: RefiSnapshot
  onSubmit: (e: React.FormEvent) => void
  firstName: string; setFirstName: (v: string) => void
  email: string; setEmail: (v: string) => void
  emailError: string; setEmailError: (v: string) => void
  submitting: boolean
  submitted: boolean
  serverError: boolean
}) {
  const saving = result.monthlySavings
  const positive = saving > 0

  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="border border-lendzingo-green/30 rounded-xl overflow-hidden">
      {submitted ? (
        /* ── Success state ── */
        <div className="px-6 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-lendzingo-green-light border border-lendzingo-green/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-lendzingo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-serif text-xl font-bold text-lendzingo-ink mb-2">
            {firstName.trim() ? `You're in, ${firstName.trim()}.` : "You're in."}
          </p>
          <p className="font-sans text-sm text-lendzingo-muted leading-relaxed">
            We&rsquo;ll send your first rate update in <span className="font-semibold text-lendzingo-ink">{nextMonth}</span>.
            One email per month, unsubscribe anytime.
          </p>
        </div>
      ) : (
        <>
          {/* ── Header with snapshot summary ── */}
          <div className="bg-lendzingo-green-light border-b border-lendzingo-green/20 px-6 py-5">
            <p className="text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-2">
              Monthly Rate Tracking
            </p>
            <p className="font-serif text-lg font-bold text-lendzingo-ink mb-1">
              We&rsquo;ll watch rates for you every month.
            </p>
            {/* Snapshot summary line */}
            <p className="font-sans text-sm text-lendzingo-muted leading-relaxed">
              {positive
                ? `Right now you'd save ${usd.format(saving)}/mo — ${Math.round(result.progressPercent)}% of the way to your ${usd.format(result.targetMonthlySavings)} goal. We'll email you the moment you hit it.`
                : `Rates aren't quite there yet. We'll email you once a month with an update so you can see your progress. Plus, the moment we think you can hit your target, we'll let you know.`}
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={onSubmit} noValidate className="px-6 py-5 space-y-4">
            <div>
              <Label htmlFor="enrollFirstName">
                First name{' '}
                <span className="text-lendzingo-muted font-normal">(optional)</span>
              </Label>
              <input
                id="enrollFirstName"
                type="text"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass()}
              />
            </div>

            <div>
              <Label htmlFor="enrollEmail">Email address</Label>
              <input
                id="enrollEmail"
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
              className="w-full bg-lendzingo-green hover:bg-lendzingo-green-dark disabled:opacity-60 text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors duration-150"
            >
              {submitting ? 'Setting up your tracker…' : 'Start Tracking My Rate →'}
            </button>

            <p className="text-xs font-sans text-lendzingo-muted text-center">
              One email per month. No spam, ever. Unsubscribe with one click.
            </p>
          </form>
        </>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const defaultForm: FormValues = {
  balance: '',
  monthlyPayment: '',
  rate: '',
  startMonth: '',
  startYear: '',
  originalTerm: '30',
  newTerm: '30',
  targetSavings: '',
  creditScore: '720+',
}

export default function RefiTracker() {
  const [form, setForm] = useState<FormValues>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<RefiSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Enrollment state
  const [showEnroll, setShowEnroll] = useState(false)
  const [enrollFirstName, setEnrollFirstName] = useState('')
  const [enrollEmail, setEnrollEmail] = useState('')
  const [enrollEmailError, setEnrollEmailError] = useState('')
  const [enrollSubmitting, setEnrollSubmitting] = useState(false)
  const [enrollSubmitted, setEnrollSubmitted] = useState(false)
  const [enrollServerError, setEnrollServerError] = useState(false)
  const enrollRef = useRef<HTMLDivElement>(null)

  function set(field: keyof FormValues, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleEnroll() {
    setShowEnroll(true)
    setTimeout(() => {
      enrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  async function handleEnrollSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!enrollEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollEmail)) {
      setEnrollEmailError('Enter a valid email address')
      return
    }
    setEnrollSubmitting(true)
    setEnrollServerError(false)
    try {
      const res = await fetch('/api/refi-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: enrollFirstName.trim() || null,
          email: enrollEmail.trim().toLowerCase(),
          loanBalance: parse(form.balance),
          currentRate: parseFloat(form.rate),
          monthlyPayment: parse(form.monthlyPayment),
          loanStartMonth: parseInt(form.startMonth),
          loanStartYear: parseInt(form.startYear),
          originalTerm: parseInt(form.originalTerm),
          newTerm: parseInt(form.newTerm),
          targetSavings: parse(form.targetSavings),
          creditScore: form.creditScore,
        }),
      })
      if (!res.ok) throw new Error()
      setEnrollSubmitted(true)
    } catch {
      setEnrollServerError(true)
    } finally {
      setEnrollSubmitting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setApiError(false)
    try {
      const pmms = await fetch('/api/pmms').then((r) => r.json())
      const useRate15 = form.newTerm === '15' && pmms.rate15 != null
      const pmmsRate: number = useRate15 ? pmms.rate15 : pmms.rate30

      const snapshot = calculateSnapshot(
        {
          currentBalance: parse(form.balance),
          currentMonthlyPayment: parse(form.monthlyPayment),
          currentRate: parseFloat(form.rate),
          loanStartMonth: parseInt(form.startMonth),
          loanStartYear: parseInt(form.startYear),
          originalTerm: parseInt(form.originalTerm) as 15 | 30,
          newTerm: parseInt(form.newTerm) as 15 | 30,
          targetMonthlySavings: parse(form.targetSavings),
          creditScoreTier: form.creditScore,
        },
        pmmsRate,
        pmms.source === 'fallback',
        pmms.weekOf,
      )
      setResult(snapshot)
      // Reset enrollment state on recalculate
      setShowEnroll(false)
      setEnrollSubmitted(false)
      setEnrollFirstName('')
      setEnrollEmail('')
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        {/* ── Section 1: Current loan ───────────────────────────────── */}
        <SectionHeading>Your current loan</SectionHeading>

        <div className="space-y-5">
          <div>
            <Label htmlFor="balance">Current loan balance</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lendzingo-muted font-sans text-base">$</span>
              <input
                id="balance"
                type="text"
                inputMode="numeric"
                placeholder="285,000"
                value={form.balance}
                onChange={(e) => set('balance', formatWithCommas(e.target.value))}
                className={inputClass(!!errors.balance) + ' pl-8'}
              />
            </div>
            <Helper>The remaining principal on your mortgage</Helper>
            <ErrorMsg msg={errors.balance} />
          </div>

          <div>
            <Label htmlFor="monthlyPayment">Current monthly payment</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lendzingo-muted font-sans text-base">$</span>
              <input
                id="monthlyPayment"
                type="text"
                inputMode="numeric"
                placeholder="1,850"
                value={form.monthlyPayment}
                onChange={(e) => set('monthlyPayment', formatWithCommas(e.target.value))}
                className={inputClass(!!errors.monthlyPayment) + ' pl-8'}
              />
            </div>
            <Helper>Principal and interest only — exclude taxes, insurance, and HOA</Helper>
            <ErrorMsg msg={errors.monthlyPayment} />
          </div>

          <div>
            <Label htmlFor="rate">Current interest rate</Label>
            <div className="relative">
              <input
                id="rate"
                type="text"
                inputMode="decimal"
                placeholder="7.25"
                value={form.rate}
                onChange={(e) => set('rate', e.target.value)}
                className={inputClass(!!errors.rate) + ' pr-8'}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lendzingo-muted font-sans text-base">%</span>
            </div>
            <ErrorMsg msg={errors.rate} />
          </div>

          <div>
            <Label htmlFor="startMonth">Loan start date</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <select
                  id="startMonth"
                  value={form.startMonth}
                  onChange={(e) => set('startMonth', e.target.value)}
                  className={selectClass(!!errors.startMonth)}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
                <ErrorMsg msg={errors.startMonth} />
              </div>
              <div className="flex-1">
                <select
                  id="startYear"
                  value={form.startYear}
                  onChange={(e) => set('startYear', e.target.value)}
                  className={selectClass(!!errors.startYear)}
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
                <ErrorMsg msg={errors.startYear} />
              </div>
            </div>
            <Helper>The month and year your loan originated</Helper>
          </div>

          <div>
            <Label htmlFor="originalTerm">Original loan term</Label>
            <select
              id="originalTerm"
              value={form.originalTerm}
              onChange={(e) => set('originalTerm', e.target.value)}
              className={selectClass()}
            >
              <option value="30">30-year fixed</option>
              <option value="15">15-year fixed</option>
            </select>
          </div>
        </div>

        {/* ── Section 2: Refinancing goal ───────────────────────────── */}
        <SectionHeading>Your refinancing goal</SectionHeading>

        <div className="space-y-5">
          <div>
            <Label htmlFor="newTerm">Preferred new loan term</Label>
            <select
              id="newTerm"
              value={form.newTerm}
              onChange={(e) => set('newTerm', e.target.value)}
              className={selectClass()}
            >
              <option value="30">30-year fixed</option>
              <option value="15">15-year fixed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="targetSavings">Target monthly savings</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lendzingo-muted font-sans text-base">$</span>
              <input
                id="targetSavings"
                type="text"
                inputMode="numeric"
                placeholder="200"
                value={form.targetSavings}
                onChange={(e) => set('targetSavings', formatWithCommas(e.target.value))}
                className={inputClass(!!errors.targetSavings) + ' pl-8'}
              />
            </div>
            <Helper>How much you want to reduce your monthly payment by</Helper>
            <ErrorMsg msg={errors.targetSavings} />
          </div>

          <div>
            <Label htmlFor="creditScore">Estimated credit score</Label>
            <select
              id="creditScore"
              value={form.creditScore}
              onChange={(e) => set('creditScore', e.target.value)}
              className={selectClass()}
            >
              {CREDIT_SCORE_TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Helper>Used to estimate your personal rate adjustment</Helper>
          </div>
        </div>

        {/* ── Submit ────────────────────────────────────────────────── */}
        <div className="mt-8">
          {apiError && (
            <p className="text-sm font-sans text-red-500 mb-3">
              Something went wrong fetching today&rsquo;s rates. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lendzingo-green hover:bg-lendzingo-green-dark disabled:opacity-60 text-white font-sans font-semibold text-base px-6 py-4 rounded-lg transition-colors duration-150"
          >
            {loading ? 'Checking today’s rates…' : 'Calculate My Savings →'}
          </button>
        </div>
      </form>

      {/* ── Results ───────────────────────────────────────────────────── */}
      {result && (
        <div ref={resultsRef} className="scroll-mt-24">
          <SnapshotCard result={result} onEnroll={handleEnroll} />

          {/* ── Inline enrollment — slides in on button click ── */}
          <div
            ref={enrollRef}
            className={`scroll-mt-8 overflow-hidden transition-all duration-500 ease-in-out ${
              showEnroll ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'
            }`}
          >
            <EnrollPanel
              result={result}
              onSubmit={handleEnrollSubmit}
              firstName={enrollFirstName} setFirstName={setEnrollFirstName}
              email={enrollEmail} setEmail={setEnrollEmail}
              emailError={enrollEmailError} setEmailError={setEnrollEmailError}
              submitting={enrollSubmitting}
              submitted={enrollSubmitted}
              serverError={enrollServerError}
            />
          </div>

          <p className="text-xs font-sans text-lendzingo-muted mt-4 leading-relaxed">
            Rates shown are estimates based on the Freddie Mac Primary Mortgage Market Survey and are
            not a commitment to lend. Your actual rate will depend on your full credit profile,
            property details, and lender pricing.
          </p>

          <button
            onClick={() => {
              setResult(null)
              setShowEnroll(false)
              setEnrollSubmitted(false)
              setEnrollFirstName('')
              setEnrollEmail('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="mt-4 text-sm font-sans text-lendzingo-green hover:text-lendzingo-green-dark underline"
          >
            ← Adjust my numbers
          </button>
        </div>
      )}
    </div>
  )
}
