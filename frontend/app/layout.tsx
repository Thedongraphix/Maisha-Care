    import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Jost, Space_Grotesk } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-jost',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Maisha Care",
  description: "Maisha Care is a Web3-powered healthcare platform that leverages AI and blockchain to provide secure, decentralized medical services. It offers real-time patient monitoring, AI-driven insights, and seamless data management with a futuristic and user-friendly interface.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jost.variable} ${spaceGrotesk.variable}`}>
      <body className="font-jost w-full min-h-screen antialiased bg-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
