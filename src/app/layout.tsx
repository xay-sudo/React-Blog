
import type { Metadata } from 'next';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/data/siteSettings'; // Import site settings
import HeadInjectorClient from '@/components/layout/HeadInjectorClient'; // Import the new component

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BloggerVerse',
  description: 'Create, read, update, and delete blog posts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* AdSense Script (if not managed by headerScripts) */}
        {/* You might choose to include the main AdSense script here directly OR via the headerScripts setting */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 
          Injected Header Scripts:
          The headerScripts string (from site settings) is injected into the document.head 
          on the client-side using the HeadInjectorClient component.
          This avoids server-side hydration errors that can occur if raw HTML (like a <div>)
          is incorrectly placed within the <head> during server rendering.
          The HeadInjectorClient component handles the DOM manipulation safely on the client.
        */}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          playfairDisplay.variable,
          ptSans.variable
        )}
      >
        {/* Client component to inject header scripts after mount */}
        {siteSettings.headerScripts && <HeadInjectorClient htmlString={siteSettings.headerScripts} />}

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        
        {/* Injected Footer Scripts: A div wrapper here is valid HTML before </body>. */}
        {siteSettings.footerScripts && (
          <div dangerouslySetInnerHTML={{ __html: siteSettings.footerScripts }} />
        )}
      </body>
    </html>
  );
}
