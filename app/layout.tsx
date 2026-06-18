import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Loc Vung Modern',
  description: 'Cây cảnh Anh Quân',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/template_css.css" />
        <link rel="stylesheet" href="/css/transmenuv.css" />
        <link rel="stylesheet" href="/css/lightbox.css" />
        <link rel="stylesheet" href="/css/template.css" />
        <link rel="stylesheet" href="/css/ja.vm.css" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}