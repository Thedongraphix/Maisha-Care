'use client'
import React, { useState } from 'react'
import Logo from './Logo'
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetTrigger,
} from "@/components/ui/sheet";
import { CgMenuRight } from "react-icons/cg";
import { Link as Spy } from "react-scroll";
import { navlinks, navLinksTypes } from '@/utils/GuestNavLinks';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, BookOpen } from 'lucide-react';

const MobileNav = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-color1">
                    <CgMenuRight className='w-6 h-6' />
                </button>
            </SheetTrigger>
            <SheetContent className='w-full bg-white border-none outline-none'>
                <main className="w-full flex flex-col ">
                    <div className="w-full py-3 px-5 flex justify-between items-center">
                        <Logo href='/' classname='w-[70px]' />
                    </div>
                    <div className="w-full mt-16 flex flex-col justify-center gap-8 items-center px-6">
                        {/* Scrollable links */}
                        {navlinks.filter(link => link.isScroll).map((link: navLinksTypes) => (
                            <SheetClose asChild key={link.name}>
                                <Spy
                                    to={link.to}
                                    smooth={true}
                                    spy={true}
                                    duration={500}
                                    className={`capitalize font-jost text-color2 font-[400] text-2xl cursor-pointer hover:underline hover:text-color1 flex items-center gap-2`}
                                >
                                    {link.name}
                                    <MdOutlineArrowOutward className="w-6 h-6" />
                                </Spy>
                            </SheetClose>
                        ))}
                        
                        {/* Resources Dropdown - Hardcoded */}
                        <div className="w-full flex flex-col items-center">
                            <button 
                                onClick={() => toggleDropdown("Resources")}
                                className="capitalize font-jost text-color2 font-[400] text-2xl cursor-pointer hover:underline hover:text-color1 flex items-center gap-2 w-full justify-center"
                            >
                                <span>Resources</span>
                                <span className="text-inherit">
                                    {openDropdown === "Resources" ? 
                                        <ChevronUp className="h-5 w-5" /> : 
                                        <ChevronDown className="h-5 w-5" />
                                    }
                                </span>
                            </button>
                            
                            {openDropdown === "Resources" && (
                                <div className="mt-4 mb-2 flex flex-col gap-2 w-full bg-white rounded-lg p-3 border border-gray-100 animate-in slide-in-from-top-5 duration-300">
                                    <SheetClose asChild>
                                        <Link
                                            href="/docs"
                                            className="text-color2 hover:text-color1 flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <FileText className="h-5 w-5 text-color1" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-xl">Documentation</div>
                                                <div className="text-gray-500 text-sm mt-1">Development guides and resources</div>
                                            </div>
                                        </Link>
                                    </SheetClose>
                                    
                                    <SheetClose asChild>
                                        <Link
                                            href="/api-reference"
                                            className="text-color2 hover:text-color1 flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <BookOpen className="h-5 w-5 text-color1" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-xl">API Reference</div>
                                                <div className="text-gray-500 text-sm mt-1">Complete API documentation</div>
                                            </div>
                                        </Link>
                                    </SheetClose>
                                </div>
                            )}
                        </div>
                        
                        {/* Direct links (Patients, Doctors) */}
                        {navlinks.filter(link => !link.isScroll && !link.hasDropdown).map((link: navLinksTypes) => (
                            <SheetClose asChild key={link.name}>
                                <Link
                                    href={link.href || '/'}
                                    className={`capitalize font-jost text-color2 font-[400] text-2xl cursor-pointer hover:underline hover:text-color1 flex items-center gap-2`}
                                >
                                    {link.name}
                                    <MdOutlineArrowOutward className="w-6 h-6" />
                                </Link>
                            </SheetClose>
                        ))}
                    </div>
                </main>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav