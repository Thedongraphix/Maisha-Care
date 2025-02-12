'use client'
import React from 'react'
import { DNA } from 'react-loader-spinner'
import { Button } from '../ui/button'
import Image from 'next/image'
import { motion } from "framer-motion";
import { Button as Spy } from "react-scroll";

const HeroSection = () => {
    return (
        <main className="w-full lg:min-h-[100dvh] md:h-[600px] h-auto bg-white overflow-x-hidden flex flex-col justify-start items-center relative">
            <section className='lg:w-[55%] w-full px-4 flex flex-col items-center md:pt-16 pt-10'>
                <h1 className='text-center font-poppins font-bold md:text-5xl text-4xl text-color2'>Maisha Care: Empowering You with Decentralized Healthcare Records</h1>
                <p className='text-center font-DM text-lg font-[500] tracking-wide md:tracking-widest md:mt-1 mt-2 mb-6 text-color4/70 '>Your Health, Your Data, Your Control.
                </p>
                <div className="flex justify-center items-center gap-4">
                    <Button className='bg-color1 w-[130px] h-[40px] text-white hover:bg-color2'>Get Started</Button>
                    <Spy
                        to="about"
                        smooth={true}
                        spy={true}
                        duration={700} className='bg-white border w-[130px] h-[40px] border-color1 text-color1 rounded-md hover:bg-color1 hover:text-white'>Learn More</Spy>
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