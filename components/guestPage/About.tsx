'use client'
import React from 'react'
import { Element } from 'react-scroll'
import { Button } from '../ui/button'
import { Ripple } from '../ui/ripple'
import Image from 'next/image'
import Link from 'next/link'

const About: React.FC = () => {
    return (
        <Element name="about" className='w-full bg-white'>
            <main className="w-full md:h-[500px] grid md:grid-cols-2">
                <section className="relative flex h-[350px] md:h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-color1/5 to-transparent">
                    <div className="z-10 w-[150px] transform hover:scale-105 transition-transform duration-300">
                        <Image 
                            src="/logo.png" 
                            alt="Maisha Care Logo" 
                            className="w-full drop-shadow-xl" 
                            width={228} 
                            height={214} 
                            priority 
                            quality={100}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/fallback-logo.png';
                            }}
                        />
                    </div>
                    <Ripple color="rgba(163, 83, 119, 0.1)" />
                </section>

                <section className="flex w-full flex-col md:items-end items-start justify-center md:px-16 px-6 gap-5 py-12 bg-gradient-to-bl from-color1/5 to-transparent">
                    <h1 className="font-grotesk md:text-5xl text-3xl md:text-end text-color4 font-bold tracking-tight">
                        About Maisha Care
                    </h1>
                    <p className="text-color1 font-jost md:text-end md:text-lg text-base leading-relaxed max-w-xl">
                        Maisha Care is revolutionizing healthcare data management through blockchain technology. We empower patients with complete control over their health records while facilitating seamless collaboration between healthcare providers.
                    </p>
                    <div className="flex flex-col md:items-end items-start gap-3">
                    
                        <Link href="/consultation">
                            <Button 
                                className='bg-color1 w-[150px] h-[45px] text-white hover:bg-white hover:text-color1 border border-color1 
                                font-medium tracking-wide transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'
                                aria-label="Get Started with Maisha Care"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </Element>
    )
}

export default About