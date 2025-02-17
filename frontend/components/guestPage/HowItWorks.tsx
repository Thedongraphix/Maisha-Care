import Image from 'next/image';
import React from 'react'
import { Element } from "react-scroll";
import { Timeline } from '../ui/timeline';
const HowItWorks = () => {
    return (
        <Element name="howItWorks" className='w-full lg:px-28 px-4 bg-color4'>
            {/* step-by-step */}
            <Steps />
        </Element>
    )
}

export default HowItWorks

const Steps = () => {
    const data = [
        {
            title: "Describe Symptoms",
            content: (
                <div>
                    <p className="text-neutral-300 font-DM text-xs md:text-sm font-normal mb-8">
                        Start your journey by describing your symptoms through our user-friendly decentralized application (DApp). Whether on web or mobile, you can securely input your health concerns. Our AI-powered chatbot also enables seamless communication via WhatsApp or Telegram, making healthcare more accessible than ever.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <Image
                            src="https://i.pinimg.com/736x/b8/cd/b5/b8cdb5c2acfd0765e653558c8d61f44b.jpg"
                            alt="describe symptoms"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                        <Image
                            src="https://i.pinimg.com/736x/aa/75/04/aa750431b7112820a6c39892f8f8d1b4.jpg"
                            alt="symptoms2"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "AI-Powered Analysis",
            content: (
                <div>
                    <p className="text-neutral-200 font-DM text-xs md:text-sm font-normal mb-8">
                        Once your symptoms are recorded, Maisha-Care’s cutting-edge AI engine instantly analyzes your inputs against an extensive medical database. The AI generates a preliminary health report with recommended next steps, ensuring an efficient and data-driven approach to healthcare.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <Image
                            src="https://i.pinimg.com/736x/6a/61/e4/6a61e4de29a3caa9cf80322bc43844a4.jpg"
                            alt="analysis"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                        <Image
                            src="https://i.pinimg.com/736x/27/40/5e/27405ed39d4a2309c3abe1893a7a23c3.jpg"
                            alt="analysis"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Encrypted Case File",
            content: (
                <div>
                    <p className="text-neutral-200 font-DM text-xs md:text-sm font-normal mb-8">
                        Every interaction you have with Maisha-Care is securely encrypted and stored on IPFS (InterPlanetary File System). This ensures that only authorized professionals can access your health records while protecting your privacy from unauthorized third parties.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <Image
                            src="https://i.pinimg.com/736x/9a/a9/cf/9aa9cf2fb62d0daed33c827595ac4da2.jpg"
                            alt="file"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                        <Image
                            src="https://i.pinimg.com/736x/df/41/57/df4157f987530d07cdf5bce34511db21.jpg"
                            alt="file"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Doctor Review & Diagnosis",
            content: (
                <div>
                    <p className="text-neutral-200 font-DM text-xs md:text-sm font-normal mb-8">
                        A certified medical practitioner reviews your AI-generated report, decrypts the case file, and refines the diagnosis. The doctor can update recommendations, prescribe medication, or request further tests, ensuring that human expertise complements AI precision.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <Image
                            src="https://i.pinimg.com/736x/30/03/1c/30031c3838764d7b83a163c178e5ca1b.jpg"
                            alt="review"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                        <Image
                            src="https://i.pinimg.com/736x/ff/7a/9b/ff7a9bcd253e5b688894821b2e7588cd.jpg"
                            alt="review"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Immutable & Secure",
            content: (
                <div>
                    <p className="text-neutral-200 font-DM text-xs md:text-sm font-normal mb-8">
                        All medical interactions, including diagnoses and updates, are logged on-chain for maximum security. This blockchain-based system ensures data integrity, prevents unauthorized modifications, and guarantees transparency, giving you complete ownership of your health records.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <Image
                            src="https://i.pinimg.com/736x/a4/71/15/a47115a5b8e444d94fe3e980515b435f.jpg"
                            alt="secure"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                        <Image
                            src="https://i.pinimg.com/736x/d8/46/a4/d846a41474e89c9f02dd005b56bd2d46.jpg"
                            alt="secure"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full border border-neutral-500"
                        />
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div className="w-full">
            <Timeline data={data} />
        </div>
    )
}