import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'LifeQuest — Level Up Your Life',
  description: 'A gamified life tracker RPG. Build skills, complete quests, earn achievements, and compete with friends.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0D0D0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
