import React from 'react'
import { Element } from 'react-scroll'
import { HoverEffect } from "../ui/card-hover-effect";
import { ShieldCheck, Globe, UserCheck } from "lucide-react";

const Features = () => {
    return (
        <Element name="features" className='w-full bg-white md:py-28 py-20'>
            <section className='max-w-6xl mx-auto md:px-8 px-4 flex flex-col items-center'>
                <div className='flex flex-col items-center mb-4'>
                    <h1 className="text-color4 font-poppins font-semibold md:text-4xl text-3xl">Key Features</h1>
                    <p className="md:text-lg text-base text-center font-DM font-medium text-color1">Why Choose Maisha-Care?</p>
                </div>
                <HoverEffect items={projects} />
            </section>
        </Element>
    )
}

export default Features


const projects = [
    {
        title: "Secure & Private",
        description:
            "Your health records are encrypted and securely stored on the blockchain, ensuring only you and your assigned doctor can access them. No centralized databases mean no risk of unauthorized access.",
        icon: ShieldCheck,
    },
    {
        title: "Easy Access",
        description:
            "Access your medical records anytime, anywhere via web, mobile, or WhatsApp. No more lost files—your data is always within reach when you need it.",
        icon: Globe,
    },
    {
        title: "Data Ownership",
        description:
            "You have full control over who can access your health information. Grant or revoke permissions at any time, ensuring transparency and security over your medical history.",
        icon: UserCheck,
    },
];