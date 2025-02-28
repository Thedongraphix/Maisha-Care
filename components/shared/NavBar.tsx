'use client'
import React from 'react'
import Logo from './Logo'
import { Link as Spy } from "react-scroll";
import { navlinks, navLinksTypes } from '@/utils/GuestNavLinks';
import MobileNav from './MobileNav';
import Link from 'next/link';

const NavBar = () => {
    return (
        <header className='w-full flex justify-center items-center fixed top-0 left-0 right-0 z-50 py-2'>
            <nav className='lg:w-[65%] md:w-full w-[95%] h-[64px] flex justify-between items-center mx-auto bg-white/90 backdrop-blur-sm border border-[#DBCAD4]/50 shadow-navbarShadow rounded-[20px] px-4'>
                <Logo href='/' classname='w-[50px]' />
                <div className='hidden md:flex gap-[24px] items-center'>
                    {navlinks.map((link: navLinksTypes) => (
                        link.isScroll ? (
                            <Spy
                                key={link.name}
                                to={link.to}
                                activeClass="text-color1 before:w-1/2"
                                smooth={true}
                                spy={true}
                                offset={-100}
                                duration={500}
                                className='capitalize font-jost text-color4 font-[450] text-[16px] cursor-pointer transition-all hover:text-color1 relative before:absolute before:w-0 before:h-[2px] before:rounded-2xl before:bg-color1 before:transition-all before:duration-300 hover:before:w-1/2 before:-bottom-[1px] before:left-[1px]'
                            >
                                {link.name}
                            </Spy>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href || '/'}
                                className='capitalize font-jost text-color4 font-[450] text-[16px] cursor-pointer transition-all hover:text-color1 relative before:absolute before:w-0 before:h-[2px] before:rounded-2xl before:bg-color1 before:transition-all before:duration-300 hover:before:w-1/2 before:-bottom-[1px] before:left-[1px]'
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>
                <div className='flex items-center gap-[24px]'>
                   
                    <div className="md:hidden flex items-center">
                        <MobileNav />
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default NavBar