'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin/rate-commentary'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(from)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Incorrect password.')
        setPassword('')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
          Lendzingo Admin
        </span>
        <h1 className="font-serif text-2xl font-bold text-lendzingo-ink mb-8">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-sans font-semibold text-lendzingo-ink mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans text-lendzingo-ink focus:outline-none focus:ring-2 focus:ring-lendzingo-green"
            />
          </div>

          {error && (
            <p className="text-sm font-sans text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-lendzingo-green hover:bg-lendzingo-green-dark disabled:opacity-50 text-white font-sans font-semibold text-sm px-4 py-3 rounded-lg transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
