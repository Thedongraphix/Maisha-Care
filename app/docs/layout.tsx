import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | Maisha Care',
  description: 'Documentation for integrating with Maisha Care healthcare platform',
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 