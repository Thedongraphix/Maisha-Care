import Footer from "@/components/shared/Footer";
import MaxWrapper from "@/components/shared/MaxWrapper";
import NavBar from "@/components/shared/NavBar";
import ScrollToTopBtn from "@/components/shared/ScrollToTopBtn";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="w-full">
            <MaxWrapper>
                <NavBar />
                <main className="w-full">
                    {children}
                </main>
                <ScrollToTopBtn />
                <FloatingWhatsApp />
                
                <Footer />
            </MaxWrapper>
        </section>
    );
}