import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Consultation | Maisha Care",
    description: "Engage in an AI-powered medical consultation.",
};

export default function ConsultationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4">
            <div className="w-full max-w-4xl">
                {children}
            </div>
        </section>
    );
} 