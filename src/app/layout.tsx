import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a clean sans-serif
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

// Instantiate Inter font with a CSS variable
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define a CSS variable for Inter
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
