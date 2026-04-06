import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/shared/Toaster';

import { RootClientLayout } from '@/components/layout/RootClientLayout';

export const metadata: Metadata = {
  title: 'Evolution Prime — Crafting Leaders',
  description: 'The premium AI-driven fitness ecosystem for elite athletes, coaches, and champions.',
  keywords: 'fitness, workout, coaching, AI training, evolution prime',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootClientLayout>
          {children}
          <Toaster />
        </RootClientLayout>
      </body>
    </html>
  );
}
