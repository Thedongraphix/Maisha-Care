'use client';
import About from "@/components/guestPage/About";
import FAQs from "@/components/guestPage/FAQs";
import Features from "@/components/guestPage/Features";
import HeroSection from "@/components/guestPage/HeroSection";
import HowItWorks from "@/components/guestPage/HowItWorks";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import MaxWrapper from "@/components/shared/MaxWrapper";
import ScrollToTopBtn from "@/components/shared/ScrollToTopBtn";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

export default function Home() {
  return (
    <section className="w-full">
      <MaxWrapper>
        <NavBar />
        <main className="w-full flex flex-col overflow-x-hidden">
          <HeroSection />
          <About />
          <Features />
          <HowItWorks />
          <FAQs />
        </main>
        <ScrollToTopBtn />
        <FloatingWhatsApp />
        <Footer />
      </MaxWrapper>
    </section>
  );
}