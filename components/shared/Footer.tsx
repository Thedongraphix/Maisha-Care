'use client'
import { useState, useEffect } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
    const [year, setYear] = useState('')

    useEffect(() => {
        const year = new Date().getFullYear()
        setYear(year.toString())
    }, [])
    return (
        <footer className='w-full bg-color4 flex flex-col lg:px-20 md:px-12 px-4 py-10'>
            <section className='w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-6 md:gap-0 border-b border-color5/15 pb-4'>
                <Logo href='/' classname=' md:w-[60px] w-[60px]' />

                <div className='flex items-center gap-4'>
                    <Link href="/https://x.com/_maishacare" target='_blank' className='text-neutral-400 transition hover:text-neutral-200'>
                        <FaXTwitter className='w-6 h-6' />
                    </Link>
                    <Link href="/" target='_blank' className='text-neutral-400 transition hover:text-neutral-200'>
                        <FaLinkedin className='w-6 h-6' />
                    </Link>
                </div>
            </section>
            <section className='w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 md:gap-0 pt-4'>
                <p className='text-sm font-[400] font-poppins text-neutral-400'>Built by the Maisha Care team</p>
                <p className='font-[400] font-poppins text-sm text-neutral-400'>© {year} Maisha Care. All rights reserved.</p>
            </section>
        </footer>
    )
}

export default Footer