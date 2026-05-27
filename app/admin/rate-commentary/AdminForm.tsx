'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  prefill: Record<string, any>
}

function inputClass() {
  return 'w-full border border-gray-200 rounded-lg px-4 py-3 font-sans text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4180dd] focus:border-transparent'
}

function textareaClass() {
  return inputClass() + ' resize-vertical min-h-[240px]'
}

export default function AdminForm({ prefill }: Props) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const [form, setForm] = useState({
    periodLabel:  prefill.periodLabel  ?? '',
    pmmsRate30:   String(prefill.pmmsRate30   ?? ''),
    pmmsRate15:   String(prefill.pmmsRate15   ?? ''),
    pmmsRatePrev30: String(prefill.pmmsRatePrev30 ?? ''),
    rateSummary:  prefill.rateSummary  ?? '',
    outlook:      prefill.outlook      ?? '',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rateSummary.trim() || !form.outlook.trim()) {
      setError('Rate summary and outlook are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/rate-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pmmsRate30:    parseFloat(form.pmmsRate30),
          pmmsRate15:    form.pmmsRate15 ? parseFloat(form.pmmsRate15) : null,
          pmmsRatePrev30: form.pmmsRatePrev30 ? parseFloat(form.pmmsRatePrev30) : null,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '48px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#4180dd',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Lendzingo Admin
          </p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#7c8591', fontFamily: 'sans-serif',
              padding: 0, textDecoration: 'underline',
            }}
          >
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
        <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 28,
          fontWeight: 700, color: '#1f2526' }}>
          Edit Rate Commentary
        </h1>
        <p style={{ margin: '8px 0 0', fontFamily: 'sans-serif', fontSize: 14, color: '#7c8591' }}>
          This copy will appear in every Refi Tracker email sent during this two-week window.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Period */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
            color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
            Period label
          </label>
          <input
            type="text"
            placeholder="e.g. June 1–14, 2026"
            value={form.periodLabel}
            onChange={e => set('periodLabel', e.target.value)}
            className={inputClass()}
          />
        </div>

        {/* Rates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
              color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
              30-yr rate (%)
            </label>
            <input type="text" inputMode="decimal" placeholder="6.81"
              value={form.pmmsRate30} onChange={e => set('pmmsRate30', e.target.value)}
              className={inputClass()} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
              color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
              15-yr rate (%)
            </label>
            <input type="text" inputMode="decimal" placeholder="6.22"
              value={form.pmmsRate15} onChange={e => set('pmmsRate15', e.target.value)}
              className={inputClass()} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
              color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
              Prev 30-yr (%)
            </label>
            <input type="text" inputMode="decimal" placeholder="6.94"
              value={form.pmmsRatePrev30} onChange={e => set('pmmsRatePrev30', e.target.value)}
              className={inputClass()} />
          </div>
        </div>

        {/* Rate summary */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
            color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
            Rate summary
            <span style={{ fontWeight: 400, color: '#7c8591' }}> — 2–3 sentences explaining what drove rates this period</span>
          </label>
          <textarea
            value={form.rateSummary}
            onChange={e => set('rateSummary', e.target.value)}
            className={textareaClass()}
            placeholder="The 30-year fixed rate fell 13 basis points..."
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7c8591', fontFamily: 'sans-serif' }}>
            {form.rateSummary.split(/[.!?]+/).filter((s: string) => s.trim()).length} sentence(s)
          </p>
        </div>

        {/* Outlook */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
            color: '#1f2526', marginBottom: 6, fontFamily: 'sans-serif' }}>
            Expert outlook
            <span style={{ fontWeight: 400, color: '#7c8591' }}> — forward-looking prediction for next month</span>
          </label>
          <textarea
            value={form.outlook}
            onChange={e => set('outlook', e.target.value)}
            className={textareaClass()}
            placeholder="Most forecasters expect rates to hold..."
          />
        </div>

        {error && (
          <p style={{ margin: 0, fontSize: 13, color: '#dc2626', fontFamily: 'sans-serif' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: saving ? '#a0b8ec' : '#4180dd',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '14px 28px',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'sans-serif',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save & Activate Commentary →'}
        </button>

        {saved && (
          <p style={{ margin: 0, fontSize: 13, color: '#16a34a', fontFamily: 'sans-serif' }}>
            ✓ Commentary saved and active. All emails sent in this window will use this copy.
          </p>
        )}
      </form>
    </div>
  )
}
