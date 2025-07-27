import { ProductGrid } from '@/components/store/product-grid'
import { CategorySidebar } from '@/components/store/category-sidebar'
import { StoreBanner } from '@/components/store/banner'

interface StoreHomeProps {
  params: { domain: string }
}

export default function StoreHome({ params }: StoreHomeProps) {
  return (
    <div>
      <StoreBanner domain={params.domain} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64">
            <CategorySidebar domain={params.domain} />
          </aside>
          <main className="flex-1">
            <ProductGrid domain={params.domain} />
          </main>
        </div>
      </div>
    </div>
  )
}