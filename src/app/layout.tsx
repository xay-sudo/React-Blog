
import type { Metadata } from 'next';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getSiteSettings } from '@/data/siteSettings';
import HeadInjectorClient from '@/components/layout/HeadInjectorClient';
import type { CodeSnippet } from '@/types';

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

  const activeGlobalHeaderSnippets = siteSettings.snippets
    .filter((snippet: CodeSnippet) => snippet.isActive && snippet.location === 'globalHeader')
    .map((snippet: CodeSnippet) => snippet.code);

  const activeGlobalFooterSnippets = siteSettings.snippets
    .filter((snippet: CodeSnippet) => snippet.isActive && snippet.location === 'globalFooter')
    .map((snippet: CodeSnippet) => snippet.code)
    .join('\n'); 

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Active globalHeader snippets are injected client-side by HeadInjectorClient */}
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          playfairDisplay.variable,
          ptSans.variable
        )}
      >
        {/* Client component to inject globalHeader scripts after mount */}
        {activeGlobalHeaderSnippets.length > 0 && <HeadInjectorClient htmlStrings={activeGlobalHeaderSnippets} />}

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        
        {/* Injected Global Footer Scripts */}
        {activeGlobalFooterSnippets && (
          <div dangerouslySetInnerHTML={{ __html: activeGlobalFooterSnippets }} />
        )}
      </body>
    </html>
  );
}
