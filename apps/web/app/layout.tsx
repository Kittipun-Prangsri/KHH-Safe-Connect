import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'KHH Safe-Connect — NCDs Care & Requisition Portal',
  description: 'ระบบดูแล ติดตาม และสื่อสารกับผู้ป่วยโรคไม่ติดต่อเรื้อรัง (NCDs) โรงพยาบาลส่งเสริมสุขภาพตำบล KHH',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${outfit.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-clinical-900">
        {children}
      </body>
    </html>
  );
}
