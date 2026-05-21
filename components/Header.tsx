import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
  pageLabel?: string
}

export default function Header({ pageLabel = 'Home Equity Guide' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="https://lendzingo.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Image
            src="https://cdn.prod.website-files.com/697a79456fcdc9cd11a421f4/697bb645f342bc1b4ccc439f_PrimaryLogo.png"
            alt="Lendzingo"
            width={140}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <span className="text-xs font-sans font-medium text-lendzingo-green bg-lendzingo-green-light px-3 py-1 rounded-full border border-lendzingo-green/20 tracking-wide">
          {pageLabel}
        </span>
      </div>
    </header>
  )
}
