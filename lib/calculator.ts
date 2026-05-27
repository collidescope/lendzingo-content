export const LOAN_APR = 6.4 // percent, base rate for 720+ credit score
export const LOAN_TERMS = [24, 36, 48, 60] as const
export type LoanTerm = (typeof LOAN_TERMS)[number]

// ─── Credit score tiers ───────────────────────────────────────────────────────

export interface CreditScoreTier {
  label: string
  adjustment: number // percentage points added to LOAN_APR
}

export const CREDIT_SCORE_TIERS: CreditScoreTier[] = [
  { label: 'Excellent (720–850)', adjustment: 0 },    //  6.4%
  { label: 'Good (660–719)',      adjustment: 1.6 },  //  8.0%
  { label: 'Fair (600–659)',      adjustment: 3.8 },  // 10.2%
  { label: 'Poor (300–599)',      adjustment: 7.6 },  // 14.0%
]

export function effectiveLoanApr(tier: CreditScoreTier): number {
  return parseFloat((LOAN_APR + tier.adjustment).toFixed(2))
}

// ─── Card types ───────────────────────────────────────────────────────────────

export interface CardInput {
  id: string
  name: string
  balance: number // dollars
  apr: number // percent
  monthlyPayment: number // dollars — user-controlled
}

export interface CardResult extends CardInput {
  totalInterest: number
  monthsToPayoff: number
}

export interface CalcResult {
  cards: CardResult[]
  totalBalance: number
  totalCCInterest: number
  totalCCMonthlyPayment: number
  maxCCMonths: number
  loanMonthlyPayment: number
  loanTotalInterest: number
  loanTermMonths: number
  loanApr: number
  totalSavings: number
  monthlySavings: number
}

// ─── Logarithmic balance slider ───────────────────────────────────────────────
// Slider position: 0–1000 → balance: $100–$50,000

export const BALANCE_MIN = 100
export const BALANCE_MAX = 50_000
export const SLIDER_STEPS = 1000

export function sliderToBalance(pos: number): number {
  const raw = BALANCE_MIN * Math.pow(BALANCE_MAX / BALANCE_MIN, pos / SLIDER_STEPS)
  if (raw < 1_000) return Math.round(raw / 50) * 50
  if (raw < 10_000) return Math.round(raw / 100) * 100
  return Math.round(raw / 500) * 500
}

export function balanceToSlider(balance: number): number {
  return Math.round(
    (SLIDER_STEPS * Math.log(balance / BALANCE_MIN)) /
      Math.log(BALANCE_MAX / BALANCE_MIN),
  )
}

// ─── Calculation ──────────────────────────────────────────────────────────────

/** Minimum monthly payment a card issuer would require. Used as the slider floor. */
export function calcMinPayment(balance: number, apr: number): number {
  const monthlyRate = apr / 100 / 12
  const firstMonthInterest = balance * monthlyRate
  // Must always exceed the first month's interest by at least $1 so principal
  // is reduced every month (at 24% APR, 2% minimum = 2% interest — no progress).
  return Math.ceil(Math.max(balance * 0.02, firstMonthInterest + 1, 25) / 5) * 5
}

export function calcCardPayoff(
  balance: number,
  apr: number,
  monthlyPayment: number,
): { totalInterest: number; monthsToPayoff: number } {
  const monthlyRate = apr / 100 / 12

  let remaining = balance
  let totalInterest = 0
  let months = 0

  while (remaining > 0.01 && months < 1_200) {
    const interest = remaining * monthlyRate
    const principal = monthlyPayment - interest
    if (principal <= 0) {
      // Payment doesn't cover interest — flag as unresolvable
      return { totalInterest: Infinity, monthsToPayoff: 9_999 }
    }
    totalInterest += interest
    remaining = Math.max(0, remaining - principal)
    months++
  }

  return { totalInterest, monthsToPayoff: months }
}

export function calcLoan(
  totalBalance: number,
  termMonths: number,
  apr = LOAN_APR,
): { monthlyPayment: number; totalInterest: number } {
  const r = apr / 100 / 12
  const n = termMonths
  const monthlyPayment =
    (totalBalance * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
  const totalInterest = monthlyPayment * n - totalBalance
  return { monthlyPayment, totalInterest }
}

export function calculate(cards: CardInput[], loanTerm: LoanTerm, loanApr = LOAN_APR): CalcResult {
  const cardResults: CardResult[] = cards.map((card) => {
    const { totalInterest, monthsToPayoff } = calcCardPayoff(
      card.balance,
      card.apr,
      card.monthlyPayment,
    )
    return { ...card, totalInterest, monthsToPayoff }
  })

  const totalBalance = cards.reduce((s, c) => s + c.balance, 0)
  const totalCCInterest = cardResults.reduce((s, c) => s + c.totalInterest, 0)
  const totalCCMonthlyPayment = cardResults.reduce((s, c) => s + c.monthlyPayment, 0)
  const maxCCMonths = Math.max(...cardResults.map((c) => c.monthsToPayoff))

  const { monthlyPayment: loanMonthlyPayment, totalInterest: loanTotalInterest } =
    calcLoan(totalBalance, loanTerm, loanApr)

  return {
    cards: cardResults,
    totalBalance,
    totalCCInterest,
    totalCCMonthlyPayment,
    maxCCMonths,
    loanMonthlyPayment,
    loanTotalInterest,
    loanTermMonths: loanTerm,
    loanApr,
    totalSavings: totalCCInterest - loanTotalInterest,
    monthlySavings: totalCCMonthlyPayment - loanMonthlyPayment,
  }
}
