/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
        'iran-sans': ['IRANSans', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        // Mall brand colors as mentioned in product description
        'mall': {
          'red': '#dc2626',
          'blue': '#2563eb', 
          'white': '#ffffff',
          'gray': '#6b7280',
        },
        // Persian color palette
        'persian': {
          'blue': '#1d4ed8',
          'red': '#dc2626',
          'green': '#059669',
          'gold': '#d97706',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  // RTL support
  future: {
    hoverOnlyWhenSupported: true,
  },
};
