'use client'
import About from "@/components/guestPage/About";
import FAQs from "@/components/guestPage/FAQs";
import Features from "@/components/guestPage/Features";
import HeroSection from "@/components/guestPage/HeroSection";
import HowItWorks from "@/components/guestPage/HowItWorks";

export default function GuestPage() {
  return (
    <main className="w-full flex flex-col overflow-x-hidden">
      <HeroSection />
      <About />
      <Features />
      <HowItWorks />
      <FAQs />
    </main>
  );
} 