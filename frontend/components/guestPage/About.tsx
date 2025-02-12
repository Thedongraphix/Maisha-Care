import React from 'react'
import { Element } from 'react-scroll'
import { Button } from '../ui/button'
import { Ripple } from '../ui/ripple'
import Image from 'next/image'

const About = () => {
    return (
        <Element name="about" className='w-full bg-color2'>
            <main className="w-full md:h-[500px] grid md:grid-cols-2">
                <section className="relative flex h-[350px] md:h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent">
                    <div className="z-10 w-[120px]">
                        <Image src="/logo.png" alt="Logo" className="w-full" width={228} height={214} priority quality={100} />
                    </div>
                    <Ripple />
                </section>

                <section className="flex w-full flex-col md:items-end items-start justify-center md:px-16 px-4 gap-3 py-10 bg-transparent">
                    <h1 className="font-poppins md:text-4xl text-2xl md:text-end text-color1 font-semibold">About Maisha Care</h1>
                    <p className="text-neutral-200 font-DM md:text-end md:text-lg text-base">Maisha Care is revolutionizing healthcare data management through blockchain technology. We empower patients with control over their health records while facilitating seamless collaboration between healthcare providers.</p>
                    <Button className='bg-color1 w-[130px] h-[40px] text-white hover:bg-neutral-200 hover:text-color1'>Get Started</Button>
                </section>
            </main>
        </Element>
    )
}

export default About