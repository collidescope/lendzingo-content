// /admin/rate-commentary
// Pre-populated edit form that Scott lands on when clicking "Edit" in Slack.
// The proposal data is passed as a base64-encoded query param.
// Submitting saves the commentary (DB insert stubbed for now).

import AdminForm from './AdminForm'

interface PageProps {
  searchParams: { data?: string }
}

export const metadata = {
  title: 'Edit Rate Commentary — Lendzingo Admin',
  robots: 'noindex, nofollow',
}

export default function AdminPage({ searchParams }: PageProps) {
  // Decode the pre-fill data passed from the Slack Edit button
  let prefill: Record<string, any> = {}
  if (searchParams.data) {
    try {
      prefill = JSON.parse(
        Buffer.from(decodeURIComponent(searchParams.data), 'base64').toString('utf-8'),
      )
    } catch {
      // ignore malformed data — form renders empty
    }
  }

  return <AdminForm prefill={prefill} />
}
