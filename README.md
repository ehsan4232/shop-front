# Mall Platform Frontend

Next.js frontend application for the Mall e-commerce platform.

## Features

- **Multi-Store Support**: Dynamic store website generation
- **Persian Language**: Full RTL support with next-intl
- **Admin Dashboard**: Store management interface
- **Real-time Updates**: Live theme switching and content updates
- **Responsive Design**: Mobile-first responsive layouts
- **SEO Optimized**: Server-side rendering with Next.js

## Quick Start

### Development

1. **Clone and install**
   ```bash
   git clone https://github.com/ehsan4232/shop-front.git
   cd shop-front
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API settings
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
shop-front/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── store/             # Store website pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # App providers
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── store/            # Store-specific components
│   ├── ui/               # Shared UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client
│   ├── utils.ts         # Helper functions
│   └── store.ts         # State management
├── styles/              # Global styles
├── public/              # Static assets
└── types/               # TypeScript definitions
```

## Key Routes

### Public Routes
- `/` - Platform landing page
- `/auth` - Authentication pages
- `/stores/{domain}` - Store websites

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/settings` - Store settings
- `/admin/themes` - Theme customization

### Store Routes (Dynamic)
- `/{store}/` - Store homepage
- `/{store}/products` - Product catalog
- `/{store}/categories/{category}` - Category pages
- `/{store}/cart` - Shopping cart
- `/{store}/checkout` - Checkout process

## Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **API Client**: Axios with React Query
- **UI Components**: Headless UI + Custom components
- **Internationalization**: next-intl
- **Charts**: Recharts
- **TypeScript**: Full type safety

## Features

### Multi-Store Architecture
- Dynamic routing based on store domain
- Isolated store data and themes
- Custom domain and subdomain support

### Persian Language Support
- RTL layout support
- Persian typography and fonts
- Localized date and number formatting
- Cultural UI patterns

### Theme System
- Real-time theme switching
- Multiple layout options
- Color customization
- Typography options

### Admin Dashboard
- Product management with drag-drop
- Order processing and tracking
- Customer management
- Sales analytics and reporting
- Theme and layout customization

### Store Features
- Product catalog with filtering
- Shopping cart and checkout
- Customer accounts
- Order tracking
- Social media integration

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Environment Variables

Create `.env.local` with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=fa

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=true
```

### Code Style

- Use TypeScript for all components
- Follow the component structure pattern
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Use React Query for API calls

## API Integration

The frontend connects to the Django backend API:

- Authentication via JWT tokens
- RESTful API endpoints
- Real-time updates via WebSocket (planned)
- Image upload and management

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker

```bash
docker build -t mall-frontend .
docker run -p 3000:3000 mall-frontend
```

### Traditional Hosting

```bash
npm run build
# Deploy the .next folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the code style guidelines
4. Test your changes
5. Submit a pull request

## License

Proprietary - All rights reserved