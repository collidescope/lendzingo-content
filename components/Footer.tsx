import Image from 'next/image'
import Link from 'next/link'

const legalLinks = [
  { label: 'Terms and Conditions', href: 'https://lendzingo.com/terms-and-conditions', external: true },
  { label: 'Privacy Policy', href: 'https://lendzingo.com/privacy-policy', external: true },
  { label: 'Advertising Disclosures', href: 'https://lendzingo.com/disclosures', external: true },
]

const productLinks = [
  { label: 'HELOC', href: '/smarter-ways-to-borrow#heloc' },
  { label: 'Home Equity Loan', href: '/smarter-ways-to-borrow#home-equity-loan' },
  { label: 'Cash-Out Refinance', href: '/smarter-ways-to-borrow#cash-out-refi' },
  { label: 'Personal Loan', href: '/smarter-ways-to-borrow#personal-loan' },
  { label: 'Debt Consolidation', href: '/smarter-ways-to-borrow#debt-consolidation' },
]

const companyLinks = [
  { label: 'Lendzingo.com', href: 'https://lendzingo.com', external: true },
]

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="text-sm hover:text-white transition-colors"
    >
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-lendzingo-footer-bg text-gray-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link href="https://lendzingo.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="https://cdn.prod.website-files.com/697a79456fcdc9cd11a421f4/697bb645f342bc1b4ccc439f_PrimaryLogo.png"
                alt="Lendzingo"
                width={120}
                height={32}
                className="h-7 w-auto brightness-0 invert opacity-80"
              />
            </Link>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-3">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-3">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-sans font-semibold text-white uppercase tracking-widest mb-3">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            Content on this site is for informational purposes only and does not constitute financial advice. Lendzingo is an advertising-supported comparison service.
          </p>
          <p className="text-xs text-gray-600">
            © 2026 Lendzingo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
