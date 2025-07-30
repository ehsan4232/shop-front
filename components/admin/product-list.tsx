'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorPicker } from '@/components/product/color-picker'
import { SocialMediaImportButton } from '@/components/product/social-media-import'
import { AlertTriangle, Package, Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

interface Product {
  id: string
  name_fa: string
  sku: string
  stock_quantity: number
  base_price: number
  status: string
  category_name: string
  brand_name: string
  is_featured: boolean
  stock_warning_message: string
  created_at: string
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product =>
      product.name_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [products, searchQuery])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.products.list()
      setProducts(response.results || response)
    } catch (error) {
      toast.error('خطا در بارگذاری محصولات')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`آیا مطمئن هستید که می‌خواهید محصول "${productName}" را حذف کنید؟`)) {
      return
    }

    try {
      await api.products.delete(productId)
      toast.success('محصول با موفقیت حذف شد')
      fetchProducts()
    } catch (error) {
      toast.error('خطا در حذف محصول')
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'published': { label: 'منتشر شده', variant: 'default' as const },
      'draft': { label: 'پیش‌نویس', variant: 'secondary' as const },
      'archived': { label: 'بایگانی', variant: 'outline' as const },
      'out_of_stock': { label: 'ناموجود', variant: 'destructive' as const }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getStockBadge = (product: Product) => {
    // Product description requirement: "warning when 3 or less instances remaining"
    if (product.stock_quantity === 0) {
      return <Badge variant="destructive">ناموجود</Badge>
    } else if (product.stock_quantity <= 3) {
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          موجودی کم ({product.stock_quantity})
        </Badge>
      )
    } else {
      return <Badge variant="outline">{product.stock_quantity} عدد</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="جستجو در محصولات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            محصول جدید
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">محصولی یافت نشد</h3>
            <p className="text-muted-foreground text-center mb-4">
              {products.length === 0 
                ? 'هنوز محصولی ایجاد نکرده‌اید. اولین محصول خود را اضافه کنید.'
                : 'محصولی با این جستجو یافت نشد.'
              }
            </p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                ایجاد محصول اول
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{product.name_fa}</h3>
                      {product.is_featured && (
                        <Badge variant="secondary">ویژه</Badge>
                      )}
                      {getStatusBadge(product.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">کد محصول:</span> {product.sku || 'تعریف نشده'}
                      </div>
                      <div>
                        <span className="font-medium">قیمت:</span> {product.base_price?.toLocaleString('fa-IR')} تومان
                      </div>
                      <div>
                        <span className="font-medium">دسته‌بندی:</span> {product.category_name || 'تعریف نشده'}
                      </div>
                      <div>
                        <span className="font-medium">برند:</span> {product.brand_name || 'تعریف نشده'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">موجودی:</span>
                        {getStockBadge(product)}
                      </div>
                      
                      {/* Stock warning message as per product description */}
                      {product.stock_warning_message && (
                        <div className="flex items-center gap-1 text-orange-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          {product.stock_warning_message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/store/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteProduct(product.id, product.name_fa)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">خلاصه آمار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm text-muted-foreground">کل محصولات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">منتشر شده</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.stock_quantity <= 3 && p.stock_quantity > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">موجودی کم</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock_quantity === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">ناموجود</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
