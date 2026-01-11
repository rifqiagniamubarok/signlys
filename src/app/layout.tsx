import type { Metadata } from 'next';
import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Signlys - Free Online PDF Signature Editor | Add Digital Signatures to PDFs',
  description:
    'Sign PDF documents online for free with Signlys. Add digital signatures, draw or upload signatures, and sign multiple pages effortlessly. No registration required.',
  keywords: 'pdf signature, sign pdf online, digital signature, pdf editor, sign documents, online signature tool, free pdf signer',
  authors: [{ name: 'Signlys Team' }],
  creator: 'Signlys',
  publisher: 'Signlys',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://signlys.com',
    siteName: 'Signlys',
    title: 'Signlys - Free Online PDF Signature Editor',
    description: 'Sign PDF documents online for free. Add digital signatures with ease.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Signlys - PDF Signature Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signlys - Free Online PDF Signature Editor',
    description: 'Sign PDF documents online for free. Add digital signatures with ease.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://signlys.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
