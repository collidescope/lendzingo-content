'use client'

import {
  BALANCE_MIN,
  BALANCE_MAX,
  SLIDER_STEPS,
  sliderToBalance,
  balanceToSlider,
  calcMinPayment,
} from '@/lib/calculator'
import type { CardInput } from '@/lib/calculator'

const APR_MIN = 10
const APR_MAX = 36

interface CreditCardRowProps {
  card: CardInput
  canRemove: boolean
  onChange: (updated: CardInput) => void
  onRemove: () => void
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function fillPct(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100)
}

function Slider({
  value,
  min,
  max,
  step = 1,
  fillPercent,
  onChange,
  ariaLabel,
}: {
  value: number
  min: number
  max: number
  step?: number
  fillPercent: number
  onChange: (v: number) => void
  ariaLabel: string
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className="calc-slider"
      style={{
        background: `linear-gradient(to right, #2282e4 0%, #2282e4 ${fillPercent}%, #e5e7eb ${fillPercent}%, #e5e7eb 100%)`,
      }}
    />
  )
}

export default function CreditCardRow({ card, canRemove, onChange, onRemove }: CreditCardRowProps) {
  const sliderPos = balanceToSlider(card.balance)
  const balanceFill = fillPct(sliderPos, 0, SLIDER_STEPS)
  const aprFill = fillPct(card.apr, APR_MIN, APR_MAX)

  const minPayment = calcMinPayment(card.balance, card.apr)
  const maxPayment = Math.min(card.balance, Math.max(500, minPayment * 5))
  const paymentFill = Math.max(0, Math.min(100, fillPct(card.monthlyPayment, minPayment, maxPayment)))

  function setBalance(pos: number) {
    const newBalance = sliderToBalance(pos)
    const newMin = calcMinPayment(newBalance, card.apr)
    onChange({ ...card, balance: newBalance, monthlyPayment: Math.max(card.monthlyPayment, newMin) })
  }

  function setApr(apr: number) {
    const newApr = parseFloat(apr.toFixed(1))
    const newMin = calcMinPayment(card.balance, newApr)
    onChange({ ...card, apr: newApr, monthlyPayment: Math.max(card.monthlyPayment, newMin) })
  }

  function setPayment(payment: number) {
    onChange({ ...card, monthlyPayment: payment })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Card name */}
      <div className="flex items-end justify-between gap-3 mb-5">
        <div className="flex-1">
          <label className="block text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-wide mb-1.5">
            Card name
          </label>
          <input
            type="text"
            value={card.name}
            onChange={(e) => onChange({ ...card, name: e.target.value })}
            placeholder="e.g. Chase Sapphire, Capital One…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 font-sans text-sm text-lendzingo-ink placeholder:text-lendzingo-muted focus:outline-none focus:ring-2 focus:ring-lendzingo-green focus:border-transparent transition-colors"
          />
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-xs font-sans text-lendzingo-muted hover:text-red-400 transition-colors pb-2"
            aria-label={`Remove ${card.name}`}
          >
            Remove
          </button>
        )}
      </div>

      {/* Balance slider */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-wide">
            Balance
          </span>
          <span className="font-sans font-bold text-base text-lendzingo-ink tabular-nums">
            {usd.format(card.balance)}
          </span>
        </div>
        <Slider
          value={sliderPos}
          min={0}
          max={SLIDER_STEPS}
          fillPercent={balanceFill}
          onChange={setBalance}
          ariaLabel={`${card.name} balance`}
        />
        <p className="text-xs font-sans text-lendzingo-muted mt-1.5">
          Find your balance on your most recent statement
        </p>
      </div>

      {/* APR slider */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-wide">
            Current APR
          </span>
          <span className="font-sans font-bold text-base text-lendzingo-ink tabular-nums">
            {card.apr.toFixed(1)}%
          </span>
        </div>
        <Slider
          value={card.apr}
          min={APR_MIN}
          max={APR_MAX}
          step={0.1}
          fillPercent={aprFill}
          onChange={setApr}
          ariaLabel={`${card.name} APR`}
        />
        <p className="text-xs font-sans text-lendzingo-muted mt-1.5">
          Your exact APR is on your monthly statement. The national average is around 24%.
        </p>
      </div>

      {/* Monthly payment slider */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-sans font-semibold text-lendzingo-ink uppercase tracking-wide">
            Monthly Payment
          </span>
          <span className="font-sans font-bold text-base text-lendzingo-ink tabular-nums">
            {usd.format(card.monthlyPayment)}
          </span>
        </div>
        <Slider
          value={card.monthlyPayment}
          min={minPayment}
          max={maxPayment}
          step={5}
          fillPercent={paymentFill}
          onChange={setPayment}
          ariaLabel={`${card.name} monthly payment`}
        />
        <p className="text-xs font-sans text-lendzingo-muted mt-1.5">
          How much you currently pay each month on this card
        </p>
      </div>
    </div>
  )
}
