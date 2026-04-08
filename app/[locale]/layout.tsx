import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400'],
});

const locales = ['pt', 'en'];

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://pablostefan.com.br'),
  title: {
    default: 'Pablo Stefan | Software Architect · Flutter · XP Inc.',
    template: '%s | Pablo Stefan',
  },
  description:
    'Portfólio de Pablo Stefan, Software Architect no Design System SOMA da XP Inc. Especializado em Flutter, Design Systems e arquitetura mobile.',
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }],
    apple: [{ url: '/apple-icon', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Pablo Stefan | Software Architect · Flutter · XP Inc.',
    description:
      'Software Architect no Design System SOMA da XP Inc. Flutter, Design Systems e arquitetura mobile de alto impacto.',
    siteName: 'Pablo Stefan',
    locale: 'pt_BR',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pablo Stefan | Software Architect · Flutter · XP Inc.',
    description:
      'Software Architect no Design System SOMA da XP Inc. Flutter, Design Systems e arquitetura mobile.',
  },
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg-base text-content font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <SplashScreen />
          <ScrollProgress />
          <Navbar />
          <main id="top">{children}</main>
          <Footer />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export { LocaleLayout as default };
