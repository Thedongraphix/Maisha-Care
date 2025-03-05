import MaxWrapper from "@/components/shared/MaxWrapper";
import ScrollToTopBtn from "@/components/shared/ScrollToTopBtn";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

export default function ConsultationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="w-full">
            <MaxWrapper>
                {children}
                <ScrollToTopBtn />
                <FloatingWhatsApp />
            </MaxWrapper>
        </section>
    );
} 