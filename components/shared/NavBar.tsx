'use client'
import React, { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { Link as Spy } from "react-scroll";
import { navlinks, navLinksTypes } from '@/utils/GuestNavLinks';
import MobileNav from './MobileNav';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, BookOpen } from 'lucide-react';

const NavBar = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='w-full flex justify-center items-center fixed top-0 left-0 right-0 z-50 py-2'>
            <nav className='lg:w-[65%] md:w-full w-[95%] h-[64px] flex justify-between items-center mx-auto bg-white/90 backdrop-blur-sm border border-[#DBCAD4]/50 shadow-navbarShadow rounded-[20px] px-4'>
                <Logo href='/' classname='w-[50px]' />
                <div className='hidden md:flex gap-[24px] items-center'>
                    {/* Home, About, etc. links */}
                    {navlinks.filter(link => link.isScroll).map((link: navLinksTypes) => (
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
                    ))}
                    
                    {/* Resources Dropdown - Stand-alone component */}
                    <div className="relative inline-block" ref={dropdownRef}>
                        <button 
                            onClick={() => toggleDropdown("Resources")}
                            className='capitalize font-jost text-color4 font-[450] text-[16px] cursor-pointer transition-all hover:text-color1 relative before:absolute before:w-0 before:h-[2px] before:rounded-2xl before:bg-color1 before:transition-all before:duration-300 hover:before:w-1/2 before:-bottom-[1px] before:left-[1px] flex items-center gap-1'
                        >
                            <span>Resources</span>
                            <span className="text-inherit">
                                {openDropdown === "Resources" ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                }
                            </span>
                        </button>
                        {openDropdown === "Resources" && (
                            <div className="absolute top-[calc(100%+4px)] right-0 bg-white rounded-lg shadow-xl overflow-hidden w-[280px] py-2 z-50 border border-gray-200 animate-in fade-in-50 zoom-in-95 duration-200">
                                <Link
                                    href="/docs"
                                    className="block px-4 py-3 text-color4 hover:bg-color1/5 hover:text-color1 transition-all"
                                    onClick={() => setOpenDropdown(null)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <FileText className="h-5 w-5 text-color1" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[15px]">Documentation</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Development guides and resources</div>
                                        </div>
                                    </div>
                                </Link>
                                
                                <Link
                                    href="/api-reference"
                                    className="block px-4 py-3 text-color4 hover:bg-color1/5 hover:text-color1 transition-all"
                                    onClick={() => setOpenDropdown(null)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <BookOpen className="h-5 w-5 text-color1" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-[15px]">API Reference</div>
                                            <div className="text-gray-500 text-xs mt-0.5">Complete API documentation</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Patients and Doctors links */}
                    {navlinks.filter(link => !link.isScroll && !link.hasDropdown).map((link: navLinksTypes) => (
                        <Link
                            key={link.name}
                            href={link.href || '/'}
                            className='capitalize font-jost text-color4 font-[450] text-[16px] cursor-pointer transition-all hover:text-color1 relative before:absolute before:w-0 before:h-[2px] before:rounded-2xl before:bg-color1 before:transition-all before:duration-300 hover:before:w-1/2 before:-bottom-[1px] before:left-[1px]'
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className='flex items-center gap-[24px]'>
                    {/*<Link
                        href="/login"
                        className='md:w-[130px] w-[110px] h-[40px] flex justify-center items-center bg-color1 rounded-[8px] border-none cursor-pointer text-[14px] font-[500] font-jost text-white hover:bg-color2 transition-colors'
                    >
                        Login
                    </Link> */}
                    <div className="md:hidden flex items-center">
                        <MobileNav />
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default NavBar