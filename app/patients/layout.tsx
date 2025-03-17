import MaxWrapper from "@/components/shared/MaxWrapper";
import ScrollToTopBtn from "@/components/shared/ScrollToTopBtn";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import { motion } from "framer-motion";

export default function PatientsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-color1/5 via-white to-color1/5">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:10px_10px] opacity-50"></div>
            </div>
            <MaxWrapper className="relative z-10">
                {children}
                <ScrollToTopBtn />
                <FloatingWhatsApp />
            </MaxWrapper>
        </section>
    );
} 