'use client'
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

const ScrollToTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show button between 200px and 70% of the page
            if (scrollY > 200 && scrollY < (documentHeight - windowHeight * 1.5)) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="fixed md:bottom-8 md:right-8 bottom-6 right-4 z-[99]">
            {isVisible && (
                <button 
                    type="button" 
                    onClick={scrollToTop} 
                    className="px-3.5 py-3.5 duration-200 transition-all text-white md:text-2xl text-base rounded-[8px] bg-gradient-to-br from-color1 to-color2 hover:scale-110"
                >
                    <MdKeyboardDoubleArrowUp />
                </button>
            )}
        </div>
    )
}

export default ScrollToTopBtn