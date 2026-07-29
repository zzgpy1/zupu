import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '族谱系统',
  description: '基于 Cloudflare D1 的家族族谱管理',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="container mx-auto p-4 max-w-6xl min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
