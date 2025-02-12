'use client'
import About from "@/components/guestPage/About";
import HeroSection from "@/components/guestPage/HeroSection";
import HowItWorks from "@/components/guestPage/HowItWorks";


export default function Home() {
  return (
    <main className="w-full flex flex-col overflow-x-hidden">
      <HeroSection />
      <About />
      <HowItWorks />
    </main>
  );
}
