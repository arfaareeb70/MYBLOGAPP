import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';

import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://deenelevate.com'),
  title: {
    default: 'Deen Elevate - Islamic Blogs & Duas',
    template: '%s | Deen Elevate',
  },
  description: 'Discover authentic Islamic knowledge, beautiful duas, and insightful blog posts to elevate your spiritual journey.',
  keywords: ['dua', 'deen', 'islamic blogs', 'hadith', 'quran', 'islamic knowledge', 'muslim lifestyle', 'spiritual growth', 'sunnah', 'prophetic duas'],
  openGraph: {
    title: 'Deen Elevate - Islamic Blogs & Duas',
    description: 'Discover authentic Islamic knowledge, beautiful duas, and insightful blog posts.',
    url: 'https://deenelevate.com',
    siteName: 'Deen Elevate',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}

