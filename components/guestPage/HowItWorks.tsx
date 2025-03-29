"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Element } from "react-scroll";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
    return (
        <Element 
            name="howItWorks" 
            className="w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-28"
        >
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-color1 to-color4 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 md:text-lg max-w-2xl mx-auto font-medium">
                        Experience healthcare reimagined through our secure, AI-powered platform
                    </p>
                </motion.div>
                
                <ModernSlider />
            </div>
        </Element>
    );
};

export default HowItWorks;

const ModernSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    
    const AUTOPLAY_INTERVAL = 3000; // 3 seconds
    
    const data = [
        {
            title: "Describe Symptoms",
            content: "Start your journey by describing your symptoms through our user-friendly decentralized application (DApp). Whether on web or mobile, you can securely input your health concerns. Our AI-powered chatbot also enables seamless communication via WhatsApp or Telegram, making healthcare more accessible than ever.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
            icon: "💬",
            color: "from-blue-500 to-cyan-400"
        },
        {
            title: "AI-Powered Analysis",
            content: "Once your symptoms are recorded, Maisha-Care's cutting-edge AI engine instantly analyzes your inputs against an extensive medical database. The AI generates a preliminary health report with recommended next steps, ensuring an efficient and data-driven approach to healthcare.",
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2032&auto=format&fit=crop",
            icon: "🧠",
            color: "from-purple-500 to-indigo-500"
        },
        {
            title: "Encrypted Case File",
            content: "Every interaction you have with Maisha-Care is securely encrypted and stored on IPFS (InterPlanetary File System). This ensures that only authorized professionals can access your health records while protecting your privacy from unauthorized third parties.",
            image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1974&auto=format&fit=crop",
            icon: "🔒",
            color: "from-emerald-500 to-teal-400"
        },
        {
            title: "Doctor Review & Diagnosis",
            content: "A certified medical practitioner reviews your AI-generated report, decrypts the case file, and refines the diagnosis. The doctor can update recommendations, prescribe medication, or request further tests, ensuring that human expertise complements AI precision.",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
            icon: "👨‍⚕️",
            color: "from-color1 to-color4"
        },
        {
            title: "Immutable & Secure",
            content: "All medical interactions, including diagnoses and updates, are logged on-chain for maximum security. This blockchain-based system ensures data integrity, prevents unauthorized modifications, and guarantees transparency, giving you complete ownership of your health records.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1968&auto=format&fit=crop",
            icon: "🔗",
            color: "from-amber-500 to-orange-400"
        }
    ];

    const handleNext = React.useCallback(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, [data.length]);
    
    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        let progressInterval: string | number | NodeJS.Timeout | undefined;
        
        if (isAutoPlaying) {
            // Reset progress when slide changes
            setProgress(0);
            
            // Progress bar animation
            const startTime = Date.now();
            progressInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = (elapsedTime / AUTOPLAY_INTERVAL) * 100;
                if (newProgress <= 100) {
                    setProgress(newProgress);
                }
            }, 16); // ~60fps

            // Slide change interval
            interval = setInterval(() => {
                handleNext();
            }, AUTOPLAY_INTERVAL);
        }
        
        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [currentIndex, isAutoPlaying, handleNext]);


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
            <motion.div 
                className="flex justify-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                {data.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-3 w-3 mx-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-gradient-to-r from-color1 to-color4 w-10' : 'bg-gray-200'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </motion.div>

            <div className="overflow-hidden relative rounded-2xl shadow-xl">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-20">
                    <motion.div
                        className="h-full bg-white/30"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
                
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
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-gradient-to-br ${data[currentIndex].color} rounded-2xl relative overflow-hidden`}>
                            {/* Decorative blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-20 -translate-y-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full transform -translate-x-20 translate-y-32"></div>
                            
                            <div className="flex flex-col justify-center space-y-6 order-2 md:order-1 relative z-10">
                                <motion.div 
                                    className="flex items-center gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-4xl p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-inner">
                                        {data[currentIndex].icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {data[currentIndex].title}
                                    </h3>
                                </motion.div>
                                
                                <motion.p 
                                    className="text-white/90 font-DM text-base md:text-lg leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {data[currentIndex].content}
                                </motion.p>
                                
                                <motion.div 
                                    className="flex items-center gap-6 pt-4 text-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                        {`Step ${currentIndex + 1} of ${data.length}`}
                                    </span>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handlePrev}
                                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                            aria-label="Previous slide"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            onClick={handleNext}
                                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                            aria-label="Next slide"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                className="flex flex-col order-1 md:order-2 relative z-10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20
                                }}
                            >
                                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-white/20">
                                    <Image
                                        src={data[currentIndex].image}
                                        alt={`${data[currentIndex].title} illustration`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};