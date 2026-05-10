interface CalloutBoxProps {
  children: React.ReactNode
}

export default function CalloutBox({ children }: CalloutBoxProps) {
  return (
    <div className="my-6 bg-lendzingo-green-light border-l-4 border-lendzingo-green rounded-r-lg px-5 py-4">
      <p className="text-sm leading-relaxed text-lendzingo-ink font-sans">{children}</p>
    </div>
  )
}
