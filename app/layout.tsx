import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team Dashboard - Тестове завдання',
  description: 'Міні-дашборд для управління командою та задачами',
  keywords: 'team, dashboard, tasks, management, react, nextjs',
  authors: [{ name: 'Frontend Developer Test' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk' className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full flex flex-col h-screen">{children}</div>
      </body>
    </html>
  );
}
