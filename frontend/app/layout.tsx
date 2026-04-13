import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Raleway } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '../components/ui/CustomCursor'
import SmoothScroll from '../components/layout/SmoothScroll'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Dazzler Diam Jewels | Luxury Diamond Jewellery',
    template: '%s | Dazzler Diam Jewels',
  },
  description: 'Exquisite lab-grown and natural diamond jewellery crafted for the discerning. IGI & GIA certified. Custom bespoke pieces for USA, UK, Canada, Dubai & Hong Kong.',
  keywords: ['diamond jewellery', 'lab grown diamonds', 'IGI certified', 'GIA certified', 'luxury jewellery', 'custom rings', 'bespoke jewellery'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dazzlerdiamjewels.com',
    siteName: 'Dazzler Diam Jewels',
    title: 'Dazzler Diam Jewels | Luxury Diamond Jewellery',
    description: 'Exquisite diamond jewellery crafted for the discerning.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dazzler Diam Jewels',
    description: 'Exquisite diamond jewellery crafted for the discerning.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} ${raleway.variable}`}>
      <body>
        <SmoothScroll>
          <CustomCursor />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0d0d0d',
                color: '#f0ece4',
                border: '1px solid rgba(216, 154, 24, 0.3)',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '12px',
                letterSpacing: '0.05em',
              },
            }}
          />
        </SmoothScroll>
      </body>
    </html>
  )
}
