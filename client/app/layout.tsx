// 'use client';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/style.css";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import { PrivyProviderWrapper } from '@/providers/PrivyProvider';

// Dynamic imports
const BufferProvider = dynamic(
  () => import("@/components/providers/buffer-provider"),
  {
    ssr: false,
  }
);

// Font configurations
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Maisha Care",
  description: "Health Onchain",
};

export const dynamicConfig = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BufferProvider>
            <PrivyProviderWrapper>
              {children}
            </PrivyProviderWrapper>
          </BufferProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
