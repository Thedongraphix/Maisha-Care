"use client";
import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

const Testimonials = () => {
    return (
        <section className="w-full bg-white flex flex-col items-center md:py-28 py-20 relative px-4 md:px-0">
            <div className='flex flex-col items-center mb-8'>
                <h1 className="text-color2 font-poppins font-semibold md:text-4xl text-3xl">Testimonials</h1>
                <p className="md:text-lg text-base text-center font-DM font-medium text-color1">Hear from Those Who Trust Us</p>
            </div>
            <AnimatedTestimonials />

            <BiSolidQuoteAltLeft className="absolute top-4 left-4 w-16 h-16 md:w-28 md:h-28 text-color4 opacity-10" />
        </section>
    )
}

export default Testimonials


const AnimatedTestimonials = () => {
    const [active, setActive] = useState(testimonials[0]);
    const handleprev = () => {
        const currentIndex = testimonials.indexOf(active);
        const length = testimonials.length;
        const prevIndex = (currentIndex - 1 + length) % length;
        setActive(testimonials[prevIndex]);
    };
    const handlenext = () => {
        const currentIndex = testimonials.indexOf(active);
        const length = testimonials.length;
        const nextIndex = (currentIndex + 1) % length;
        setActive(testimonials[nextIndex]);
    };
    const isActive = (index: number) => {
        return testimonials[index] === active;
    };

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-8 max-w-5xl mx-auto">
                <div className="relative h-80 w-full">
                    <AnimatePresence>
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.9,
                                    z: -100,
                                    rotateY: randomRotateY(),
                                }}
                                animate={{
                                    opacity: isActive(index) ? 1 : 0.7,
                                    scale: isActive(index) ? 1 : 0.95,
                                    z: isActive(index) ? 0 : -100,
                                    rotate: isActive(index) ? 0 : randomRotateY(),
                                    zIndex: isActive(index)
                                        ? 999
                                        : testimonials.length + 2 - index,
                                    y: isActive(index) ? [0, -80, 0] : 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.9,
                                    z: 100,
                                    rotate: randomRotateY(),
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 origin-bottom"
                                key={active.name}
                            >
                                <Image
                                    src={testimonial.src}
                                    alt={testimonial.name}
                                    width={400}
                                    height={400}
                                    draggable={false}
                                    className="rounded-3xl h-full w-full  object-cover object-center"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div>
                    <div className="flex justify-between flex-col py-4">
                        <motion.div
                            key={active.name}
                            initial={{
                                y: 20,
                                opacity: 0,
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                            }}
                            exit={{
                                y: -20,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                        >
                            <h3 className="text-2xl font-bold text-color2">
                                {active.name}
                            </h3>
                            <p className="text-sm text-color1">
                                {active.designation}
                            </p>
                            <motion.p className="text-lg text-gray-500 md:mt-8 mt-4">
                                {active.quote.split(" ").map((word, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{
                                            filter: "blur(10px)",
                                            opacity: 0,
                                            y: 5,
                                        }}
                                        animate={{
                                            filter: "blur(0px)",
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                            delay: 0.02 * index,
                                        }}
                                        className="inline-block"
                                    >
                                        {word}&nbsp;
                                    </motion.span>
                                ))}
                            </motion.p>
                        </motion.div>
                    </div>
                    <div className="flex gap-6 md:pt-5 pt-3">
                        <Button className="h-8 bg-color1 hover:bg-color2  rounded" onClick={handleprev}>
                            <ArrowLeft />
                        </Button>
                        <Button className="h-8 bg-color1 hover:bg-color2 rounded " onClick={handlenext}>
                            <ArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};


const testimonials: Testimonial[] = [
    {
        quote:
            "Maisha-Care has completely transformed the way I access healthcare. The security and privacy it provides through blockchain and AI are unmatched.",
        name: "Ananya Gupta",
        designation: "HealthTech Advocate",
        src: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb",
    },
    {
        quote:
            "The ability to access my medical records anytime without worrying about security is a game-changer. Maisha-Care makes healthcare seamless and transparent.",
        name: "Sophia Allen",
        designation: "Patient & Digital Health Enthusiast",
        src: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb",
    },
    {
        quote:
            "As a doctor, Maisha-Care helps me securely review and update patient records without the risk of data breaches. The encryption and blockchain integration are revolutionary.",
        name: "Ethan Rodriguez",
        designation: "Medical Practitioner",
        src: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb",
    },
    {
        quote:
            "The synergy between AI and blockchain in Maisha-Care ensures accurate diagnostics and secure patient data. It’s the future of digital healthcare.",
        name: "Priya Sharma",
        designation: "AI & Healthcare Researcher",
        src: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb",
    },
];
