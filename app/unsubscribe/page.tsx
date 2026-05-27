'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type PageState = 'confirm' | 'loading' | 'success' | 'already' | 'error'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [state, setState] = useState<PageState>('confirm')
  const [errorMsg, setErrorMsg] = useState('')

  // Guard against missing params on mount
  useEffect(() => {
    if (!email || !token) {
      setState('error')
      setErrorMsg('This unsubscribe link is missing required information. Please use the link directly from your email.')
    }
  }, [email, token])

  async function handleUnsubscribe() {
    setState('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      })
      const data = await res.json()

      if (res.ok) {
        setState(data.alreadyUnsubscribed ? 'already' : 'success')
      } else {
        setState('error')
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setState('error')
      setErrorMsg('Unable to process your request. Please try again.')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      {state === 'confirm' && (
        <div>
          <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
            Email Preferences
          </span>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2rem)] font-bold text-lendzingo-ink leading-tight mb-4">
            Unsubscribe from Refi Tracker updates
          </h1>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-ink mb-2">
            You&rsquo;ll no longer receive monthly mortgage rate updates at:
          </p>
          <p className="font-sans font-semibold text-lendzingo-ink mb-8 break-all">
            {email}
          </p>
          <button
            onClick={handleUnsubscribe}
            className="inline-block bg-lendzingo-green hover:bg-lendzingo-green-dark text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Confirm unsubscribe
          </button>
          <p className="font-sans text-sm text-lendzingo-muted mt-6">
            Changed your mind?{' '}
            <Link href="/refi-tracker" className="text-lendzingo-green underline underline-offset-2">
              Go back to the Refi Tracker
            </Link>
          </p>
        </div>
      )}

      {state === 'loading' && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-lendzingo-green border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sans text-lendzingo-muted">Processing&hellip;</p>
        </div>
      )}

      {state === 'success' && (
        <div>
          <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
            You&rsquo;re unsubscribed
          </span>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2rem)] font-bold text-lendzingo-ink leading-tight mb-4">
            We&rsquo;ve removed you from monthly updates.
          </h1>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted mb-8">
            You won&rsquo;t receive any more Refi Tracker emails at{' '}
            <span className="text-lendzingo-ink font-semibold">{email}</span>.
            If rates move significantly in your favor, we won&rsquo;t bug you.
          </p>
          <p className="font-sans text-sm text-lendzingo-muted">
            Unsubscribed by mistake?{' '}
            <Link href="/refi-tracker" className="text-lendzingo-green underline underline-offset-2">
              Re-enroll on the Refi Tracker
            </Link>
          </p>
        </div>
      )}

      {state === 'already' && (
        <div>
          <span className="block text-xs font-sans font-semibold text-lendzingo-green uppercase tracking-[0.15em] mb-3">
            Already unsubscribed
          </span>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2rem)] font-bold text-lendzingo-ink leading-tight mb-4">
            You&rsquo;re already off the list.
          </h1>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted mb-8">
            We don&rsquo;t have an active subscription for{' '}
            <span className="text-lendzingo-ink font-semibold">{email}</span>.
            You won&rsquo;t receive any emails from us.
          </p>
          <p className="font-sans text-sm text-lendzingo-muted">
            <Link href="/refi-tracker" className="text-lendzingo-green underline underline-offset-2">
              Go back to the Refi Tracker
            </Link>
          </p>
        </div>
      )}

      {state === 'error' && (
        <div>
          <span className="block text-xs font-sans font-semibold text-red-500 uppercase tracking-[0.15em] mb-3">
            Something went wrong
          </span>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2rem)] font-bold text-lendzingo-ink leading-tight mb-4">
            We couldn&rsquo;t process your request.
          </h1>
          <p className="font-sans text-[1.05rem] leading-[1.8] text-lendzingo-muted mb-8">
            {errorMsg}
          </p>
          <p className="font-sans text-sm text-lendzingo-muted">
            <Link href="/refi-tracker" className="text-lendzingo-green underline underline-offset-2">
              Go back to the Refi Tracker
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
