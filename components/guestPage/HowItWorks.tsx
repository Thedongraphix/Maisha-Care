"use client";

import Image from 'next/image';
import React, { useState, useEffect} from 'react';
import { Element } from "react-scroll";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
    return (
<Element 
            name="howItWorks" 
            className='w-full lg:px-28 px-4 bg-white py-16 rounded-[60px] md:rounded-[120px] lg:rounded-[160px]'>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-color4 mb-4">How It Works</h2>
                <p className="text-color1 max-w-2xl mx-auto">
                    Experience healthcare reimagined through our secure, AI-powered platform
                </p>
            </div>
            <ModernSlider />
        </Element>
    );
};

export default HowItWorks;

const ModernSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    
    const data = [
        {
            title: "Describe Symptoms",
            content: "Start your journey by describing your symptoms through our user-friendly decentralized application (DApp). Whether on web or mobile, you can securely input your health concerns. Our AI-powered chatbot also enables seamless communication via WhatsApp or Telegram, making healthcare more accessible than ever.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
            icon: "💬"
        },
        {
            title: "AI-Powered Analysis",
            content: "Once your symptoms are recorded, Maisha-Care's cutting-edge AI engine instantly analyzes your inputs against an extensive medical database. The AI generates a preliminary health report with recommended next steps, ensuring an efficient and data-driven approach to healthcare.",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2032&auto=format&fit=crop",
            icon: "🧠"
        },
        {
            title: "Encrypted Case File",
            content: "Every interaction you have with Maisha-Care is securely encrypted and stored on IPFS (InterPlanetary File System). This ensures that only authorized professionals can access your health records while protecting your privacy from unauthorized third parties.",
            image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1974&auto=format&fit=crop",
            icon: "🔒"
        },
        {
            title: "Doctor Review & Diagnosis",
            content: "A certified medical practitioner reviews your AI-generated report, decrypts the case file, and refines the diagnosis. The doctor can update recommendations, prescribe medication, or request further tests, ensuring that human expertise complements AI precision.",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
            icon: "👨‍⚕️"
        },
        {
            title: "Immutable & Secure",
            content: "All medical interactions, including diagnoses and updates, are logged on-chain for maximum security. This blockchain-based system ensures data integrity, prevents unauthorized modifications, and guarantees transparency, giving you complete ownership of your health records.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1968&auto=format&fit=crop",
            icon: "🔗"
        }
    ];

    const handleNext = React.useCallback(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, [data.length]); // Add data.length as a dependency
    
    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying ,handleNext]);


    const handleDotClick = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    function handlePrev(): void {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    }
    return (
        <div 
            className="w-full relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="flex justify-center mb-8">
                {data.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-3 w-3 mx-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-color1 w-8' : 'bg-gray-200'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="overflow-hidden relative rounded-xl">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8 bg-gradient-to-br from-color1/10 to-color1/5 rounded-xl border border-color1/20">
                            <div className="flex flex-col justify-center space-y-4 order-1 md:order-1">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{data[currentIndex].icon}</div>
                                    <h3 className="text-lg md:text-xl font-bold text-color4">
                                        {`${data[currentIndex].title}`}
                                    </h3>
                                </div>
                                <p className="text-color1 font-DM text-sm md:text-base">
                                    {data[currentIndex].content}
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-4 order-2 md:order-2">
                                <div className="relative aspect-video rounded-lg overflow-hidden max-h-[300px]">
                                    <Image
                                        src={data[currentIndex].image}
                                        alt={`${data[currentIndex].title} illustration`}
                                        fill
                                        className="object-cover object-[center_35%] border border-color1/20 rounded-lg"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                                
                                <div className="flex items-center justify-center gap-4">
                                    <span className="text-color1 text-sm">{`${currentIndex + 1} of ${data.length}`}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handlePrev}
                                            className="w-8 h-8 rounded-full bg-color1/10 hover:bg-color1 hover:text-white flex items-center justify-center text-color1 transition-colors"
                                            aria-label="Previous slide"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={handleNext}
                                            className="w-8 h-8 rounded-full bg-color1/10 hover:bg-color1 hover:text-white flex items-center justify-center text-color1 transition-colors"
                                            aria-label="Next slide"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};