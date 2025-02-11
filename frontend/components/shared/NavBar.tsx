'use client'
import React from 'react'
import Logo from './Logo'
import { Link as Spy } from "react-scroll";
import { navlinks, navLinksTypes } from '@/utils/GuestNavLinks';
import MobileNav from './MobileNav';

const NavBar = () => {
    return (

        <header className='w-full flex justify-center items-center'>

            <nav className='lg:w-[65%] md:w-full w-[95%]  h-[64px] flex justify-between items-center md:mt-[20px] mt-[12px] border border-[#DBCAD4]/50 shadow-navbarShadow rounded-[20px] px-4'>

                <Logo href='/' classname='w-[50px]' />
                <div className='hidden md:flex gap-[24px] font-poppins items-center'>
                    {
                        navlinks.map((link: navLinksTypes) => (
                            <Spy
                                key={link.name}
                                to={link.to}
                                smooth={true}
                                spy={true}
                                duration={700}
                                className={`capitalize font-DM text-color4 font-[450] text-[16px] cursor-pointer transition-all hover:text-strimzPrimary relative before:absolute before:w-0 before:h-[2px] before:rounded-2xl before:bg-color1 before:transition-all before:duration-300 hover:before:w-1/2 before:-bottom-[1px] before:left-[1px]`}
                            >
                                {link.name}
                            </Spy>
                        ))
                    }
                </div>
                <div className='flex items-center gap-[24px]'>
                    <button
                        type="button"
                        className={`md:w-[130px] w-[110px] h-[40px] flex justify-center items-center bg-color1 rounded-[8px] border-none cursor-pointer text-[14px] font-[500] font-poppins text-white`}
                    >
                        Login
                    </button>

                    <div className="md:hidden flex items-center">
                        <MobileNav />
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default NavBar