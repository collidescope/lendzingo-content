// ─── Refi Tracker Monthly Email Template ──────────────────────────────────────
//
// Pure function — takes data, returns a complete HTML string ready to send.
// Uses table-based layout + inline styles for maximum email client compatibility.

export interface RefiEmailData {
  // Personalization
  firstName: string | null

  // Current snapshot (calculated at send time from live PMMS)
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number          // negative = costs more to refi
  targetMonthlySavings: number
  progressPercent: number         // 0–100, capped for display
  goalReached: boolean
  adjustedRate: number            // rate used for the new payment calc

  // Month-over-month (null = first email, skip the section)
  prevMonthlySavings: number | null
  prevNewMonthlyPayment: number | null
  prevPmmsRate30: number | null

  // Live rate data
  pmmsRate30: number
  pmmsRate15: number | null
  weekOf: string | null           // e.g. "May 22, 2026"

  // Approved commentary (from rate_commentary table, shared across 2-week window)
  rateSummary: string             // 2–3 sentences about what drove rate movement
  outlook: string                 // forward-looking prediction

  // Meta
  monthLabel: string              // e.g. "June 2026"
  siteBaseUrl: string             // e.g. "https://content.lendzingo.com"
  unsubscribeUrl: string
}

// ─── Formatting helpers ────────────────────────────────────────────────────────

const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const pct = (n: number) => `${Math.abs(n).toFixed(2)}%`

const deltaLabel = (current: number, prev: number) => {
  const diff = current - prev
  if (Math.abs(diff) < 1) return null  // ignore < $1 change
  return { amount: Math.abs(diff), direction: diff > 0 ? 'up' : 'down' }
}

// ─── Color tokens ─────────────────────────────────────────────────────────────

const C = {
  brand:      '#4180dd',
  brandDark:  '#2e6acc',
  brandLight: '#eef3fd',
  ink:        '#1f2526',
  muted:      '#7c8591',
  border:     '#e2e8f0',
  bg:         '#f4f7fc',
  white:      '#ffffff',
  green:      '#16a34a',
  red:        '#dc2626',
  amber:      '#d97706',
}

// ─── Section helpers ───────────────────────────────────────────────────────────

function sectionLabel(text: string) {
  return `
    <p style="margin:0 0 14px; font-family:Arial,Helvetica,sans-serif; font-size:11px;
       font-weight:bold; color:${C.brand}; letter-spacing:0.12em; text-transform:uppercase;">
      ${text}
    </p>`
}

function divider() {
  return `<tr><td style="padding:0 36px;"><div style="height:1px; background:${C.border};"></div></td></tr>
          <tr><td style="height:28px;"></td></tr>`
}

function sectionWrap(content: string) {
  return `<tr><td style="padding:0 36px 28px;">${content}</td></tr>`
}

// ─── Section 1: Snapshot ──────────────────────────────────────────────────────

function snapshotSection(d: RefiEmailData): string {
  const positive = d.monthlySavings > 0
  const savingsColor = positive ? C.green : C.red
  const savingsLabel = positive ? 'Monthly Savings' : 'Monthly Difference'
  const savingsValue = positive ? usd(d.monthlySavings) : `-${usd(Math.abs(d.monthlySavings))}`
  const progress = Math.min(Math.round(d.progressPercent), 100)
  const remaining = d.targetMonthlySavings - d.monthlySavings

  const progressBar = d.goalReached ? '' : `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 8px;">
      <tr>
        <td width="${progress}%" style="background:${C.brand}; height:8px; font-size:0; line-height:0;
          border-radius:${progress >= 100 ? '6px' : '6px 0 0 6px'};">&nbsp;</td>
        ${progress < 100 ? `<td style="background:${C.border}; height:8px; font-size:0; line-height:0; border-radius:0 6px 6px 0;">&nbsp;</td>` : ''}
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${C.muted};">
          Progress toward ${usd(d.targetMonthlySavings)}/mo goal
        </td>
        <td align="right" style="font-family:Arial,Helvetica,sans-serif; font-size:12px;
          font-weight:bold; color:${C.ink};">${progress}%</td>
      </tr>
    </table>`

  const statusLine = d.goalReached
    ? `<p style="margin:16px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:14px;
         color:${C.green}; font-weight:bold;">
         You've hit your savings goal. Now's a great time to talk to a lender.
       </p>`
    : positive
    ? `<p style="margin:8px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${C.muted}; line-height:1.5;">
         Rates need to drop a bit more before you hit your ${usd(d.targetMonthlySavings)}/mo target.
         You're ${usd(Math.max(0, remaining))}/mo away.
       </p>`
    : `<p style="margin:8px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${C.muted}; line-height:1.5;">
         At today's rates, refinancing would cost more than your current payment.
         Your existing rate is still competitive.
       </p>`

  return `
    ${sectionLabel('Your Snapshot')}
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1px solid ${C.border}; border-radius:10px; overflow:hidden; margin-bottom:4px;">
      <tr>
        <td align="center" style="padding:18px 10px; border-right:1px solid ${C.border}; width:33%;">
          <p style="margin:0 0 5px; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:${C.muted};">Current Payment</p>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:24px; font-weight:bold; color:${C.ink};">${usd(d.currentMonthlyPayment)}</p>
        </td>
        <td align="center" style="padding:18px 10px; border-right:1px solid ${C.border}; width:33%;">
          <p style="margin:0 0 5px; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:${C.muted};">New Payment Today</p>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:24px; font-weight:bold; color:${C.ink};">${usd(d.newMonthlyPayment)}</p>
        </td>
        <td align="center" style="padding:18px 10px; width:33%;">
          <p style="margin:0 0 5px; font-family:Arial,Helvetica,sans-serif; font-size:11px; color:${C.muted};">${savingsLabel}</p>
          <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:24px; font-weight:bold; color:${savingsColor};">${savingsValue}</p>
        </td>
      </tr>
    </table>
    ${progressBar}
    ${statusLine}`
}

// ─── Section 2: Since Last Month ──────────────────────────────────────────────

function sinceLastMonthSection(d: RefiEmailData): string {
  if (d.prevMonthlySavings === null) return ''  // first email, skip

  const savingsDelta = deltaLabel(d.monthlySavings, d.prevMonthlySavings)
  const paymentDelta = d.prevNewMonthlyPayment !== null
    ? deltaLabel(d.newMonthlyPayment, d.prevNewMonthlyPayment)
    : null

  const savingsLine = savingsDelta
    ? savingsDelta.direction === 'up'
      ? `Your potential monthly savings <strong style="color:${C.green};">increased by ${usd(savingsDelta.amount)}</strong> since last month.`
      : `Your potential monthly savings <strong style="color:${C.red};">decreased by ${usd(savingsDelta.amount)}</strong> since last month.`
    : 'Your potential monthly savings held steady since last month.'

  const paymentLine = paymentDelta
    ? paymentDelta.direction === 'down'
      ? ` Your estimated new payment dropped to <strong>${usd(d.newMonthlyPayment)}</strong> (was ${usd(d.prevNewMonthlyPayment!)}).`
      : ` Your estimated new payment moved to <strong>${usd(d.newMonthlyPayment)}</strong> (was ${usd(d.prevNewMonthlyPayment!)}).`
    : ''

  return `
    ${divider()}
    ${sectionWrap(`
      ${sectionLabel('Since Last Month')}
      <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:15px; color:${C.ink}; line-height:1.7;">
        ${savingsLine}${paymentLine}
      </p>
    `)}`
}

// ─── Section 3: Rate Movement ─────────────────────────────────────────────────

function ratesSection(d: RefiEmailData): string {
  const rate30Dir = d.prevPmmsRate30 !== null
    ? d.pmmsRate30 < d.prevPmmsRate30 ? 'down' : d.pmmsRate30 > d.prevPmmsRate30 ? 'up' : 'flat'
    : null
  const rate30Diff = d.prevPmmsRate30 !== null ? Math.abs(d.pmmsRate30 - d.prevPmmsRate30) : 0
  const rate30Color = rate30Dir === 'down' ? C.green : rate30Dir === 'up' ? C.red : C.muted
  const rate30Arrow = rate30Dir === 'down' ? '↓' : rate30Dir === 'up' ? '↑' : '→'

  const rateRow = (label: string, current: number, prev: number | null, dir: string | null, diff: number, color: string, arrow: string) => `
    <tr>
      <td style="padding:12px 16px; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${C.ink}; border-right:1px solid ${C.border}; width:50%;">
        ${label}
      </td>
      <td style="padding:12px 16px; width:50%;">
        <span style="font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:bold; color:${C.ink};">${pct(current)}</span>
        ${prev !== null ? `
          <span style="margin-left:8px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${color}; white-space:nowrap;">
            ${arrow} ${pct(diff)} (was ${pct(prev)})
          </span>` : ''}
      </td>
    </tr>`

  const rate15Row = d.pmmsRate15 !== null ? rateRow('15-yr fixed', d.pmmsRate15, null, null, 0, C.muted, '') : ''

  return `
    ${divider()}
    ${sectionWrap(`
      ${sectionLabel('Rates This Month')}
      <table width="100%" cellpadding="0" cellspacing="0"
        style="border:1px solid ${C.border}; border-radius:10px; overflow:hidden; margin-bottom:16px;">
        ${rateRow('30-yr fixed', d.pmmsRate30, d.prevPmmsRate30, rate30Dir, rate30Diff, rate30Color, rate30Arrow)}
        ${rate15Row ? `<tr><td colspan="2" style="height:0; border-top:1px solid ${C.border}; padding:0;"></td></tr>${rate15Row}` : ''}
        ${d.weekOf ? `
          <tr>
            <td colspan="2" style="padding:8px 16px; font-family:Arial,Helvetica,sans-serif;
              font-size:11px; color:${C.muted}; border-top:1px solid ${C.border}; background:${C.bg};">
              Freddie Mac PMMS, week of ${d.weekOf}
            </td>
          </tr>` : ''}
      </table>
      <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${C.ink}; line-height:1.75;">
        ${d.rateSummary}
      </p>
    `)}`
}

// ─── Section 4: Outlook ───────────────────────────────────────────────────────

function outlookSection(d: RefiEmailData): string {
  return `
    ${divider()}
    ${sectionWrap(`
      ${sectionLabel("What Experts Predict")}
      <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:${C.ink}; line-height:1.75;">
        ${d.outlook}
      </p>
    `)}`
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function ctaSection(d: RefiEmailData): string {
  return `
    ${divider()}
    <tr>
      <td style="padding:0 36px 36px;">
        <p style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:15px;
          color:${C.ink}; line-height:1.75;">
          If you&rsquo;re ready to take the next step, our partner
          <a href="https://www.myreficompanion.com/offer/refinance" style="color:${C.brand}; text-decoration:none; font-weight:bold;">myRefiCompanion</a>
          can help you compare current rates from
          multiple lenders and connect you with someone who can walk you through the
          refinancing process. Use the link below to calculate your potential new payment
          and get in touch with a lender.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="https://www.myreficompanion.com/offer/refinance"
                style="display:inline-block; background:${C.brand}; color:${C.white};
                  font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold;
                  text-decoration:none; padding:14px 36px; border-radius:8px;">
                Calculate Payment →
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:12px;
          color:${C.muted}; text-align:center;">
          Not ready yet? <a href="${d.siteBaseUrl}/refi-tracker" style="color:${C.brand}; text-decoration:none;">Recalculate with your latest numbers</a> anytime.
        </p>
      </td>
    </tr>`
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildRefiEmail(d: RefiEmailData): string {
  const greeting = d.firstName ? `Hi ${d.firstName},` : 'Hi there,'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Refi Tracker Update — ${d.monthLabel}</title>
</head>
<body style="margin:0; padding:0; background-color:${C.bg}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bg};">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">

        <!-- Email container -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px; width:100%; border-radius:14px; overflow:hidden;
            box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:${C.brand}; padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:22px;
                      font-weight:bold; color:${C.white}; letter-spacing:-0.3px;">Lendzingo</p>
                    <p style="margin:5px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px;
                      color:rgba(255,255,255,0.75);">Your Monthly Rate Update &middot; ${d.monthLabel}</p>
                  </td>
                  <td align="right" style="vertical-align:bottom;">
                    <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px;
                      color:rgba(255,255,255,0.55); letter-spacing:0.1em; text-transform:uppercase;">
                      Refi Tracker
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:${C.white};">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Greeting -->
                <tr>
                  <td style="padding:32px 36px 24px;">
                    <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:16px;
                      color:${C.ink}; line-height:1.6;">
                      ${greeting}<br>
                      Here&rsquo;s your mortgage rate update for ${d.monthLabel}.
                    </p>
                  </td>
                </tr>

                <!-- Snapshot -->
                ${sectionWrap(snapshotSection(d))}

                <!-- Since last month (hidden on first email) -->
                ${sinceLastMonthSection(d)}

                <!-- Rates this month -->
                ${ratesSection(d)}

                <!-- Outlook -->
                ${outlookSection(d)}

                <!-- CTA -->
                ${ctaSection(d)}

              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#f8fafc; border-top:1px solid ${C.border};
              padding:24px 36px; border-radius:0 0 14px 14px;">
              <p style="margin:0 0 8px; font-family:Arial,Helvetica,sans-serif; font-size:12px;
                color:${C.muted}; line-height:1.6;">
                You&rsquo;re receiving this because you signed up for Refi Tracker at
                <a href="${d.siteBaseUrl}" style="color:${C.brand}; text-decoration:none;">lendzingo.com</a>.
                &nbsp;&middot;&nbsp;
                <a href="${d.unsubscribeUrl}" style="color:${C.brand}; text-decoration:none;">Unsubscribe</a>
              </p>
              <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:11px;
                color:#a0aab4; line-height:1.6;">
                Rate estimates are based on the Freddie Mac Primary Mortgage Market Survey and are not
                a commitment to lend. Your actual rate will depend on your full credit profile,
                property details, and lender pricing. Lendzingo is an advertising-supported comparison
                platform and may receive compensation when you click on links to products featured on
                this site.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`
}
