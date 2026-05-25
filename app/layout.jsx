import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Nostalgic Tuiter',
  description: 'A news feed. No clickbait. No videos. No bullshit.',
  metadataBase: new URL('https://nostalgictuiter.com'),
  openGraph: {
    title: 'Nostalgic Tuiter',
    description: 'A news feed. No clickbait. No videos. No bullshit.',
    url: 'https://nostalgictuiter.com',
    siteName: 'Nostalgic Tuiter',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nostalgic Tuiter',
    description: 'A news feed. No clickbait. No videos. No bullshit.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-950`}>
        {children}
      </body>
    </html>
  );
}
