export const CREDIT_SCORE_TIERS = [
  { label: '720 or above', value: '720+', adjustment: 0 },
  { label: '700 – 719', value: '700-719', adjustment: 0.25 },
  { label: '680 – 699', value: '680-699', adjustment: 0.5 },
  { label: '660 – 679', value: '660-679', adjustment: 0.75 },
  { label: '640 – 659', value: '640-659', adjustment: 1.25 },
  { label: '620 – 639', value: '620-639', adjustment: 1.75 },
]

export interface RefiInputs {
  currentBalance: number
  currentMonthlyPayment: number
  currentRate: number
  loanStartMonth: number
  loanStartYear: number
  originalTerm: 15 | 30
  newTerm: 15 | 30
  targetMonthlySavings: number
  creditScoreTier: string
}

export interface RefiSnapshot {
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number
  targetMonthlySavings: number
  adjustedRate: number
  pmmsRate: number
  progressPercent: number
  goalReached: boolean
  usingFallbackRate: boolean
  weekOf: string | null
}

function monthlyPayment(principal: number, annualRatePct: number, termYears: number): number {
  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
}

export function calculateSnapshot(
  inputs: RefiInputs,
  pmmsRate: number,
  usingFallbackRate: boolean,
  weekOf: string | null,
): RefiSnapshot {
  const tier = CREDIT_SCORE_TIERS.find((t) => t.value === inputs.creditScoreTier)
  const adjustment = tier?.adjustment ?? 0
  const adjustedRate = pmmsRate + adjustment

  const newMonthlyPayment = monthlyPayment(inputs.currentBalance, adjustedRate, inputs.newTerm)
  const monthlySavings = inputs.currentMonthlyPayment - newMonthlyPayment
  const progressPercent =
    inputs.targetMonthlySavings > 0
      ? Math.min(100, Math.max(0, (monthlySavings / inputs.targetMonthlySavings) * 100))
      : 0

  return {
    currentMonthlyPayment: inputs.currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    targetMonthlySavings: inputs.targetMonthlySavings,
    adjustedRate,
    pmmsRate,
    progressPercent,
    goalReached: monthlySavings >= inputs.targetMonthlySavings,
    usingFallbackRate,
    weekOf,
  }
}
