'use client'
import React from 'react'
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

const MobileNav = () => {
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
                    <div className="w-full mt-16 flex flex-col justify-center gap-8 items-center">
                        {navlinks.map((link: navLinksTypes) => (
                            <SheetClose asChild key={link.name}>
                                {link.isScroll ? (
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
                                ) : (
                                    <Link
                                        href={link.href || '/'}
                                        className={`capitalize font-jost text-color2 font-[400] text-2xl cursor-pointer hover:underline hover:text-color1 flex items-center gap-2`}
                                    >
                                        {link.name}
                                        <MdOutlineArrowOutward className="w-6 h-6" />
                                    </Link>
                                )}
                            </SheetClose>
                        ))}
                    </div>
                </main>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav