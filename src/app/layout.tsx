import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MonopolyBoardProvider } from '@/context/MonopolyBoardContext'; // New import

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Monopoly Mapper',
  description: 'Generate Monopoly board properties based on a theme.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <MonopolyBoardProvider> {/* Wrap with provider */}
          {children}
        </MonopolyBoardProvider>
        <Toaster />
      </body>
    </html>
  );
}
