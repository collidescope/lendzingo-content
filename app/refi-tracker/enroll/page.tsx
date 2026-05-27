import EnrollForm from './EnrollForm'

interface PageProps {
  searchParams: {
    balance?: string
    payment?: string
    rate?: string
    startMonth?: string
    startYear?: string
    originalTerm?: string
    newTerm?: string
    targetSavings?: string
    creditScore?: string
  }
}

export const metadata = {
  title: 'Track My Rate — Lendzingo Refi Tracker',
  description: 'Sign up for monthly mortgage rate updates and know the moment refinancing makes sense for you.',
}

export default function EnrollPage({ searchParams }: PageProps) {
  return <EnrollForm params={searchParams} />
}
