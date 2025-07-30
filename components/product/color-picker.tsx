'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { X, Palette } from 'lucide-react'

// Predefined color palette for common product colors
const COMMON_COLORS = [
  // Reds
  { name: 'قرمز', value: '#DC2626', name_en: 'red' },
  { name: 'قرمز روشن', value: '#EF4444', name_en: 'light-red' },
  { name: 'قرمز تیره', value: '#991B1B', name_en: 'dark-red' },
  
  // Blues  
  { name: 'آبی', value: '#2563EB', name_en: 'blue' },
  { name: 'آبی روشن', value: '#3B82F6', name_en: 'light-blue' },
  { name: 'آبی تیره', value: '#1E40AF', name_en: 'dark-blue' },
  { name: 'آبی آسمانی', value: '#0EA5E9', name_en: 'sky-blue' },
  
  // Greens
  { name: 'سبز', value: '#16A34A', name_en: 'green' },
  { name: 'سبز روشن', value: '#22C55E', name_en: 'light-green' },
  { name: 'سبز تیره', value: '#15803D', name_en: 'dark-green' },
  
  // Yellows/Oranges
  { name: 'زرد', value: '#EAB308', name_en: 'yellow' },
  { name: 'نارنجی', value: '#EA580C', name_en: 'orange' },
  { name: 'نارنجی روشن', value: '#FB923C', name_en: 'light-orange' },
  
  // Purples/Pinks
  { name: 'بنفش', value: '#9333EA', name_en: 'purple' },
  { name: 'صورتی', value: '#EC4899', name_en: 'pink' },
  { name: 'بنفش روشن', value: '#A855F7', name_en: 'light-purple' },
  
  // Neutrals
  { name: 'سیاه', value: '#000000', name_en: 'black' },
  { name: 'سفید', value: '#FFFFFF', name_en: 'white' },
  { name: 'خاکستری', value: '#6B7280', name_en: 'gray' },
  { name: 'خاکستری روشن', value: '#9CA3AF', name_en: 'light-gray' },
  { name: 'خاکستری تیره', value: '#374151', name_en: 'dark-gray' },
  
  // Browns
  { name: 'قهوه‌ای', value: '#92400E', name_en: 'brown' },
  { name: 'قهوه‌ای روشن', value: '#B45309', name_en: 'light-brown' },
  { name: 'قهوه‌ای تیره', value: '#78350F', name_en: 'dark-brown' },
]

interface ColorValue {
  name: string
  value: string
  name_en: string
}

interface ColorPickerProps {
  label: string
  value: ColorValue[]
  onChange: (colors: ColorValue[]) => void
  placeholder?: string
  maxColors?: number
  className?: string
}

export function ColorPicker({ 
  label, 
  value = [], 
  onChange, 
  placeholder = 'انتخاب رنگ...', 
  maxColors = 10,
  className 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState('#000000')
  const [customColorName, setCustomColorName] = useState('')

  const addColor = (color: ColorValue) => {
    if (value.length >= maxColors) return
    if (value.some(c => c.value === color.value)) return
    
    onChange([...value, color])
  }

  const removeColor = (colorValue: string) => {
    onChange(value.filter(c => c.value !== colorValue))
  }

  const addCustomColor = () => {
    if (!customColorName.trim()) return
    
    const customColorObj: ColorValue = {
      name: customColorName.trim(),
      value: customColor,
      name_en: customColorName.trim().toLowerCase().replace(/\s+/g, '-')
    }
    
    addColor(customColorObj)
    setCustomColorName('')
    setCustomColor('#000000')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* Selected Colors Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
        {value.length > 0 ? (
          value.map((color) => (
            <Badge 
              key={color.value} 
              variant="secondary" 
              className="flex items-center gap-2 px-2 py-1"
            >
              {/* Color Square as specified in product description */}
              <div 
                className="w-4 h-4 rounded border border-border" 
                style={{ backgroundColor: color.value }}
                title={`${color.name} (${color.value})`}
              />
              <span className="text-sm">{color.name}</span>
              <button
                type="button"
                onClick={() => removeColor(color.value)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm py-1">{placeholder}</span>
        )}
      </div>

      {/* Color Picker Trigger */}
      {value.length < maxColors && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Palette className="w-4 h-4" />
              افزودن رنگ
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">انتخاب رنگ</h4>
              
              {/* Common Colors Palette (Colorpads as specified) */}
              <div>
                <Label className="text-sm">رنگ‌های متداول</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => addColor(color)}
                      disabled={value.some(c => c.value === color.value)}
                      className="group relative w-8 h-8 rounded border-2 border-border hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {/* White border for light colors visibility */}
                      {color.value === '#FFFFFF' && (
                        <div className="absolute inset-0.5 border border-gray-300 rounded" />
                      )}
                      
                      {/* Selection indicator */}
                      {value.some(c => c.value === color.value) && (
                        <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm">رنگ سفارشی</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-10 h-8 rounded border border-border cursor-pointer"
                    />
                    <div 
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: customColor }}
                    />
                  </div>
                  <Input
                    placeholder="نام رنگ..."
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomColor()
                      }
                    }}
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={addCustomColor}
                  disabled={!customColorName.trim()}
                  className="w-full"
                >
                  افزودن رنگ سفارشی
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Max colors indicator */}
      {maxColors && (
        <div className="text-xs text-muted-foreground">
          {value.length} از {maxColors} رنگ انتخاب شده
        </div>
      )}
    </div>
  )
}

// Helper component for single color selection
interface SingleColorPickerProps {
  label: string
  value?: ColorValue
  onChange: (color: ColorValue | undefined) => void
  placeholder?: string
  className?: string
}

export function SingleColorPicker({ 
  label, 
  value, 
  onChange, 
  placeholder = 'انتخاب رنگ...', 
  className 
}: SingleColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState('#000000')
  const [customColorName, setCustomColorName] = useState('')

  const selectColor = (color: ColorValue) => {
    onChange(color)
    setIsOpen(false)
  }

  const addCustomColor = () => {
    if (!customColorName.trim()) return
    
    const customColorObj: ColorValue = {
      name: customColorName.trim(),
      value: customColor,
      name_en: customColorName.trim().toLowerCase().replace(/\s+/g, '-')
    }
    
    selectColor(customColorObj)
    setCustomColorName('')
    setCustomColor('#000000')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {/* Selected Color Display */}
      <div className="flex items-center gap-2 min-h-[40px] p-2 border rounded-md bg-background">
        {value ? (
          <Badge variant="secondary" className="flex items-center gap-2 px-2 py-1">
            <div 
              className="w-4 h-4 rounded border border-border" 
              style={{ backgroundColor: value.value }}
            />
            <span className="text-sm">{value.name}</span>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm py-1">{placeholder}</span>
        )}
      </div>

      {/* Color Picker Trigger */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="w-4 h-4" />
            {value ? 'تغییر رنگ' : 'انتخاب رنگ'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">انتخاب رنگ</h4>
            
            {/* Common Colors */}
            <div>
              <Label className="text-sm">رنگ‌های متداول</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {COMMON_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => selectColor(color)}
                    className="group relative w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {color.value === '#FFFFFF' && (
                      <div className="absolute inset-0.5 border border-gray-300 rounded" />
                    )}
                    {value?.value === color.value && (
                      <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color */}
            <div className="space-y-3 pt-2 border-t">
              <Label className="text-sm">رنگ سفارشی</Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-10 h-8 rounded border border-border cursor-pointer"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-border"
                    style={{ backgroundColor: customColor }}
                  />
                </div>
                <Input
                  placeholder="نام رنگ..."
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomColor()
                    }
                  }}
                />
              </div>
              <Button 
                size="sm" 
                onClick={addCustomColor}
                disabled={!customColorName.trim()}
                className="w-full"
              >
                انتخاب رنگ سفارشی
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
