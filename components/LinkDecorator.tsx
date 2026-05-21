'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const DOMAINS_TO_DECORATE = [
  'myhomeequitycompanion.com',
  'mymortgagecompanion.com',
  'mypersonalloancompanion.com',
  'myreficompanion.com',
  'mydebtcompanion.com',
]

const QUERY_PARAMS = [
  'tid',
  'aid',
  'creatid',
  'campid',
  'adsetid',
  'gad_source',
  'gbraid',
  'wbraid',
  'gclid',
]

function getQueryParam(name: string): string | null {
  const match = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(window.location.search)
  return match ? decodeURIComponent(match[1]) : null
}

function decorateUrl(url: string): string {
  const separator = url.indexOf('?') === -1 ? '?' : '&'
  const collected = QUERY_PARAMS
    .map((key) => {
      const val = getQueryParam(key)
      return val ? `${key}=${val}` : null
    })
    .filter(Boolean)
  return collected.length ? url + separator + collected.join('&') : url
}

export default function LinkDecorator() {
  const pathname = usePathname()

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a')
    links.forEach((link) => {
      // Decorate affiliate links (open in new tab)
      DOMAINS_TO_DECORATE.forEach((domain) => {
        if (link.href.includes(domain) && !link.href.includes('#')) {
          link.href = decorateUrl(link.href)
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
        }
      })

      // Decorate internal same-origin links (related article cards, etc.)
      if (link.hostname === window.location.hostname && !link.href.includes('#')) {
        link.href = decorateUrl(link.href)
      }
    })
  }, [pathname])

  return null
}
