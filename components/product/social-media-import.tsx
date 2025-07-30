'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Instagram, MessageCircle, Download, Image, Video, FileText } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface SocialMediaPost {
  id: string
  platform: 'telegram' | 'instagram'
  text?: string
  images: string[]
  videos: string[]
  date: string
}

interface SocialMediaImportProps {
  onImport: (data: {
    description?: string
    images: string[]
    videos: string[]
  }) => void
  trigger?: React.ReactNode
}

export function SocialMediaImportButton({ onImport, trigger }: SocialMediaImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<SocialMediaPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [telegramChannel, setTelegramChannel] = useState('')
  const [instagramProfile, setInstagramProfile] = useState('')

  // Fetch last 5 posts from Telegram
  const fetchTelegramPosts = async () => {
    if (!telegramChannel.trim()) {
      toast.error('لطفاً نام کانال تلگرام را وارد کنید')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.socialMedia.importTelegramPosts({
        channel: telegramChannel,
        count: 5
      })
      
      const telegramPosts: SocialMediaPost[] = response.posts.map((post: any) => ({
        id: `telegram-${post.id}`,
        platform: 'telegram' as const,
        text: post.text,
        images: post.images || [],
        videos: post.videos || [],
        date: post.date
      }))
      
      setPosts(prev => [...prev.filter(p => p.platform !== 'telegram'), ...telegramPosts])
      toast.success(`${telegramPosts.length} پست از تلگرام دریافت شد`)
    } catch (error) {
      toast.error('خطا در دریافت پست‌های تلگرام')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch last 5 posts from Instagram
  const fetchInstagramPosts = async () => {
    if (!instagramProfile.trim()) {
      toast.error('لطفاً نام پروفایل اینستاگرام را وارد کنید')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.socialMedia.importInstagramPosts({
        username: instagramProfile,
        count: 5
      })
      
      const instagramPosts: SocialMediaPost[] = response.posts.map((post: any) => ({
        id: `instagram-${post.id}`,
        platform: 'instagram' as const,
        text: post.caption,
        images: post.images || [],
        videos: post.videos || [],
        date: post.date
      }))
      
      setPosts(prev => [...prev.filter(p => p.platform !== 'instagram'), ...instagramPosts])
      toast.success(`${instagramPosts.length} پست از اینستاگرام دریافت شد`)
    } catch (error) {
      toast.error('خطا در دریافت پست‌های اینستاگرام')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPosts(newSelected)
  }

  const handleImport = () => {
    const selectedPostsData = posts.filter(post => selectedPosts.has(post.id))
    
    if (selectedPostsData.length === 0) {
      toast.error('لطفاً حداقل یک پست را انتخاب کنید')
      return
    }

    // Combine selected content
    const combinedText = selectedPostsData
      .map(post => post.text)
      .filter(Boolean)
      .join('\n\n')
    
    const allImages = selectedPostsData.flatMap(post => post.images)
    const allVideos = selectedPostsData.flatMap(post => post.videos)

    onImport({
      description: combinedText,
      images: allImages,
      videos: allVideos
    })

    toast.success(`محتوای ${selectedPostsData.length} پست وارد شد`)
    setIsOpen(false)
    setPosts([])
    setSelectedPosts(new Set())
  }

  const DefaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      دریافت از شبکه اجتماعی
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || DefaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>دریافت محتوا از شبکه‌های اجتماعی</DialogTitle>
          <DialogDescription>
            آخرین ۵ پست از تلگرام و اینستاگرام خود را دریافت کرده و تصاویر، ویدیوها و متن‌ها را انتخاب کنید
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="telegram" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="telegram" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              تلگرام
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <Instagram className="w-4 h-4" />
              اینستاگرام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="telegram" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="telegram-channel">نام کانال تلگرام</Label>
                <Input
                  id="telegram-channel"
                  placeholder="@channel_name"
                  value={telegramChannel}
                  onChange={(e) => setTelegramChannel(e.target.value)}
                />
              </div>
              <Button 
                onClick={fetchTelegramPosts} 
                disabled={isLoading}
                className="mt-6"
              >
                دریافت پست‌ها
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="instagram-profile">نام پروفایل اینستاگرام</Label>
                <Input
                  id="instagram-profile"
                  placeholder="username"
                  value={instagramProfile}
                  onChange={(e) => setInstagramProfile(e.target.value)}
                />
              </div>
              <Button 
                onClick={fetchInstagramPosts} 
                disabled={isLoading}
                className="mt-6"
              >
                دریافت پست‌ها
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Posts Display */}
        {posts.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold">پست‌های دریافت شده:</h3>
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={post.platform === 'telegram' ? 'default' : 'secondary'}>
                          {post.platform === 'telegram' ? (
                            <MessageCircle className="w-3 h-3 ml-1" />
                          ) : (
                            <Instagram className="w-3 h-3 ml-1" />
                          )}
                          {post.platform === 'telegram' ? 'تلگرام' : 'اینستاگرام'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <Checkbox
                        checked={selectedPosts.has(post.id)}
                        onCheckedChange={() => togglePostSelection(post.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {post.text && (
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                        <p className="text-sm">{post.text.slice(0, 150)}...</p>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {post.images.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          {post.images.length} تصویر
                        </div>
                      )}
                      {post.videos.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {post.videos.length} ویدیو
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button 
            onClick={handleImport} 
            disabled={selectedPosts.size === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            وارد کردن محتوای انتخاب شده ({selectedPosts.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
