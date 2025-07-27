import { StoreHeader } from '@/components/store/header'
import { StoreFooter } from '@/components/store/footer'

interface StoreLayoutProps {
  children: React.ReactNode
  params: { domain: string }
}

export default function StoreLayout({ children, params }: StoreLayoutProps) {
  return (
    <div className="min-h-screen">
      <StoreHeader domain={params.domain} />
      <main>
        {children}
      </main>
      <StoreFooter />
    </div>
  )
}