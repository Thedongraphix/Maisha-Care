'use client'
import React from 'react'
import { DNA } from 'react-loader-spinner'
import Image from 'next/image'
import { motion } from "framer-motion";
import Link from 'next/link'


const HeroSection = () => {


    return (
        <main className="w-full lg:min-h-[100dvh] md:h-[600px] h-auto bg-white overflow-x-hidden flex flex-col justify-start items-center relative mt-24">
            <section className='lg:w-[55%] w-full px-4 flex flex-col items-center md:pt-16 pt-10'>
                <h1 className='text-center font-grotesk font-bold md:text-5xl text-4xl text-color4/90'>Revolutionize Your Healthcare Experience</h1>
                <p className='text-center text-lg font-[500] tracking-wide md:mt-1 mt-2 mb-6 text-color4/70'>
                    Complete consultations in under 10 minutes and a secure onchain health profile at your fingertips.
                </p>
                <div className="flex md:flex-row flex-col justify-center items-center gap-6">
    <Link 
        href="/patients" 
        className='bg-color1 px-8 rounded-xl flex justify-center items-center h-[50px] text-white hover:bg-color2 transition-colors text-lg font-medium w-[280px]'
    >
        Get AI Consultation Now
    </Link>
    <Link 
        href="/doctors" 
        className='bg-white border-2 px-8 h-[50px] border-color1 text-color1 rounded-xl hover:bg-color1 hover:text-white transition-colors flex items-center justify-center text-lg font-medium w-[280px]'
    >
        Join the E-Doc waiting list
    </Link>
</div>
                <div className="md:block hidden">
                    <DNA
                        visible={true}
                        height="350"
                        width="550"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                </div>
                <div className="block md:hidden">
                    <DNA
                        visible={true}
                        height="250"
                        width="450"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                </div>
            </section>

            <motion.div
                className="md:block hidden absolute bottom-[35%] lg:right-[80px] right-[15px] lg:w-[180px] w-[150px]"
                animate={{ y: [80, -80] }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 15 }}>
                <Image src="/1.png" alt="3d icon" className="w-full" width={800} height={800} priority quality={100} />
            </motion.div>

            <motion.div
                className="md:block hidden absolute lg:bottom-[50%] bottom-[40%] lg:left-[100px] left-[15px] lg:w-[180px] w-[150px]"
                animate={{ y: [-30, 30] }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 10 }}>
                <Image src="/2.png" alt="3d icon" className="w-full" width={800} height={800} priority quality={100} />
            </motion.div>
        </main>
    )
}

export default HeroSection