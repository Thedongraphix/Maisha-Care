import React from 'react'
import { Element } from 'react-scroll'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQs = () => {
    return (
        <Element name="faqs" className='w-full bg-color4 md:py-28 py-20 px-4 flex justify-center items-center'>
            <section className=' max-w-3xl w-full flex flex-col gap-10'>
                <div className='flex flex-col'>
                    <h1 className="text-neutral-200 md:text-5xl text-3xl font-poppins font-bold">FAQs</h1>
                    <p className='w-full text-color1 text-base font-DM font-medium'>Everything you need to know about Maisha-Care—how it works, data security, and accessing your medical records seamlessly.</p>
                </div>

                {/* FAQS */}
                <AskedQuestions />
            </section>

        </Element>
    )
}

export default FAQs


const AskedQuestions = () => {
    return (
        <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="3">
            {items.map((item) => (
                <AccordionItem value={item.id} key={item.id} className='border-color1/15 border rounded-md px-4 shadow shadow-color1/20'>
                    <AccordionTrigger className="text-neutral-300 font-poppins font-medium text-base">{item.title}</AccordionTrigger>
                    <AccordionContent className="pb-4 text-neutral-400 text-base">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

const items = [
    {
        id: "1",
        title: "How does Maisha Care keep my health records secure?",
        content:
            "Maisha Care encrypts your health records and stores them securely on the blockchain. This ensures that only you and authorized individuals can access them, eliminating risks associated with centralized databases.",
    },
    {
        id: "2",
        title: "Can I access my medical records anytime?",
        content:
            "Yes, you can access your health records anytime, anywhere through our web platform, mobile app, or WhatsApp integration. Your data is always available when you need it.",
    },
    {
        id: "3",
        title: "Who controls access to my health information?",
        content:
            "You have full ownership of your medical data. You can grant or revoke access to doctors, family members, or caregivers at any time, ensuring privacy and transparency.",
    },
    {
        id: "4",
        title: "What happens if I switch healthcare providers?",
        content:
            "With Maisha Care, your health records remain with you, not a specific hospital. You can seamlessly share your data with any healthcare provider of your choice, ensuring continuity of care.",
    },
];
