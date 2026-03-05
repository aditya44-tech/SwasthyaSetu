import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rural Health Platform',
  description: 'AI-powered rural healthcare platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans bg-[#F5F5F7] text-[#1D1D1F] min-h-screen antialiased selection:bg-[#0071E3] selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
