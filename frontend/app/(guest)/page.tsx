'use client'
import HeroSection from "@/components/guestPage/HeroSection";
import HowItWorks from "@/components/guestPage/HowItWorks";


export default function Home() {
  return (
    <main className="w-full flex flex-col overflow-x-hidden">
      <HeroSection />
      <HowItWorks />
    </main>
  );
}
