import { ProductList } from '@/components/admin/product-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Link href="/admin/products/new">
          <Button>
            افزودن محصول جدید
          </Button>
        </Link>
      </div>
      <ProductList />
    </div>
  )
}