import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AppProviders as Providers } from '@/lib/providers'


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'NexusPlay | Enterprise iGaming Platform & White-label Casino Solution',
  description: 'Launch your own casino and sportsbook in minutes. NexusPlay offers a scalable, secure, and high-performance white-label solution for agents and affiliates.',
  keywords: ['igaming platform', 'white label casino', 'sportsbook software', 'casino api', 'gambling software provider'],
  authors: [{ name: 'NexusPlay Solutions' }],
  openGraph: {
    title: 'NexusPlay - Launch Your Casino Empire',
    description: 'Enterprise-grade iGaming infrastructure. <50ms latency, anti-fraud AI, and global crypto payments.',
    url: 'https://nexusplay.io',
    siteName: 'NexusPlay',
    images: [
      {
        url: 'https://nexusplay.io/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusPlay | Next-Gen iGaming Infrastructure',
    description: 'Launch your casino & sportsbook in minutes. Scalable, secure, and global.',
    creator: '@nexusplay',
    images: ['https://nexusplay.io/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans antialiased">
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

