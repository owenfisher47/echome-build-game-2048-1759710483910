import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '2048 Game',
  description: 'A React implementation of the popular 2048 puzzle game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}