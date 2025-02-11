import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Maisha Care",
  description: "Maisha Care is a Web3-powered healthcare platform that leverages AI and blockchain to provide secure, decentralized medical services. It offers real-time patient monitoring, AI-driven insights, and seamless data management with a futuristic and user-friendly interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`w-full min-h-screen antialiased bg-color4`}
      >
        {children}
      </body>
    </html>
  );
}
