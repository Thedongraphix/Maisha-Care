import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Reference | Maisha Care',
  description: 'Complete API documentation for the Maisha Care healthcare platform',
};

export default function ApiReferenceLayout({
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