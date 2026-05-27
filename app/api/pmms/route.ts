import { NextResponse } from 'next/server'

// Freddie Mac PMMS history — updated weekly (Thursdays)
const PMMS_URL = 'https://www.freddiemac.com/pmms/docs/PMMS_history.xls'

// Fallback rates — update periodically if Freddie Mac fetch is unavailable
const FALLBACK_RATE_30 = 6.81
const FALLBACK_RATE_15 = 6.12

export const revalidate = 21600 // re-fetch every 6 hours

export async function GET() {
  try {
    const res = await fetch(PMMS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const buffer = await res.arrayBuffer()
    const XLSX = await import('xlsx')
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1 })

    // Find last row with a valid 30-yr rate
    const lastRow = [...rows]
      .reverse()
      .find((r) => r[1] !== undefined && r[1] !== '' && parseFloat(String(r[1])) > 0)

    if (!lastRow) throw new Error('No PMMS data found')

    const rate30 = parseFloat(String(lastRow[1]))
    const rate15 = lastRow[3] ? parseFloat(String(lastRow[3])) : null

    return NextResponse.json(
      { rate30, rate15, weekOf: String(lastRow[0]), source: 'freddiemac' },
      { headers: { 'Cache-Control': 's-maxage=21600, stale-while-revalidate=3600' } },
    )
  } catch {
    return NextResponse.json({
      rate30: FALLBACK_RATE_30,
      rate15: FALLBACK_RATE_15,
      weekOf: null,
      source: 'fallback',
    })
  }
}
