"use client";

import React, { useState } from 'react';
import { Element } from 'react-scroll';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, Check, Copy, ThumbsUp, ThumbsDown, Shield, Clock, UserCog, Hospital, Database, Brain } from 'lucide-react';

interface FAQItem {
    id: string;
    title: string;
    content: string;
    category: 'security' | 'access' | 'control' | 'providers' | 'ai';
    details?: string[];
    resources?: {
        label: string;
        url: string;
    }[];
}

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface ModernAccordionProps {
    items: FAQItem[];
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
    copied: string | null;
    handleCopy: (text: string, id: string) => void;
}

const FAQs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [copied, setCopied] = useState<string | null>(null);

    // Available categories
    const categories: Category[] = [
        { id: 'all', name: 'All Questions', icon: <Database size={16} /> },
        { id: 'security', name: 'Security', icon: <Shield size={16} /> },
        { id: 'access', name: 'Access', icon: <Clock size={16} /> },
        { id: 'control', name: 'Data Control', icon: <UserCog size={16} /> },
        { id: 'providers', name: 'Healthcare Providers', icon: <Hospital size={16} /> },
        { id: 'ai', name: 'AI Technology', icon: <Brain size={16} /> }
    ];

    // Filter FAQs based on search query and category
    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Handle copy to clipboard
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <Element name="faqs" className='w-full bg-white md:py-28 py-20 px-4 flex justify-center items-center'>
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='max-w-4xl w-full flex flex-col gap-10'
            >
                {/* Header */}
                <div className='flex flex-col gap-4'>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-10 bg-color1 rounded"></div>
                        <h1 className="text-color4 md:text-5xl text-3xl font-poppins font-bold">FAQs</h1>
                    </div>
                    <p className='w-full text-color1 text-base font-DM font-medium'>
                        Everything you need to know about Maisha-Care—how it works, data security, and accessing your medical records seamlessly.
                    </p>
                </div>

                {/* Search and filter bar */}
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-color1 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Category filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeCategory === category.id 
                                        ? 'bg-color1 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                                {activeCategory === category.id && 
                                    <span className="ml-1 bg-white bg-opacity-20 h-5 w-5 rounded-full flex items-center justify-center text-xs">
                                        {filteredItems.length}
                                    </span>
                                }
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {filteredItems.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ModernAccordion 
                                    items={filteredItems} 
                                    hoveredItem={hoveredItem}
                                    setHoveredItem={setHoveredItem}
                                    copied={copied}
                                    handleCopy={handleCopy}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-10 px-6 border border-gray-200 rounded-xl bg-gray-50"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <Search size={40} className="text-gray-400" />
                                    <h3 className="text-gray-700 text-lg font-medium">No matching FAQs found</h3>
                                    <p className="text-gray-500">Try different keywords or select another category</p>
                                    <button 
                                        onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
                                        className="mt-2 px-4 py-2 bg-color1 hover:bg-color1/90 text-white rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Call to action */}
                <div className="mt-6 p-6 bg-gradient-to-r from-color1/10 to-color1/5 rounded-xl border border-color1/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-color4 text-lg font-medium mb-1">Still have questions?</h3>
                            <p className="text-gray-600 text-sm">Our team is ready to assist you with any additional questions</p>
                        </div>
                        <button className="px-6 py-3 bg-color1 hover:bg-color1/90 text-white rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
                            Contact Support
                        </button>
                    </div>
                </div>
            </motion.section>
        </Element>
    );
};

const ModernAccordion: React.FC<ModernAccordionProps> = ({ items, hoveredItem, setHoveredItem, copied, handleCopy }) => {
    // Change this line from string | null to string | undefined
    const [openItem, setOpenItem] = useState<string | undefined>("3");
    const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not-helpful' | undefined>>({});

    return (
        <div className="space-y-4">
            {items.map((item) => {
                const categoryIcon = {
                    'security': <Shield size={18} className="text-green-400" />,
                    'access': <Clock size={18} className="text-yellow-400" />,
                    'control': <UserCog size={18} className="text-blue-400" />,
                    'providers': <Hospital size={18} className="text-purple-400" />,
                    'ai': <Brain size={18} className="text-red-400" />
                }[item.category];

                return (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Number(item.id) * 0.1 }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                            openItem === item.id 
                                ? 'border-color1/30 bg-gradient-to-r from-color1/5 to-transparent shadow-lg shadow-color1/5' 
                                : hoveredItem === item.id 
                                    ? 'border-gray-200 bg-gray-50' 
                                    : 'border-gray-100 bg-white'
                        }`}
                    >
                        <Accordion
                            type="single"
                            collapsible
                            value={openItem}
                            onValueChange={setOpenItem}
                            className="w-full"
                        >
                            <AccordionItem value={item.id} className="border-none">
                                <div className="relative">
                                    <AccordionTrigger 
                                        className="text-color4 font-poppins font-medium text-base py-5 px-6 hover:no-underline"
                                        // Change this line to use undefined instead of null
                                        onClick={() => setOpenItem(openItem === item.id ? undefined : item.id)}
                                    >
                                        <div className="flex items-start gap-4 w-full">
                                            {categoryIcon && <div className="flex-shrink-0 mt-1">{categoryIcon}</div>}
                                            <div className="flex-1 text-left">{item.title}</div>
                                            <div className="flex-shrink-0 mt-1">
                                                {openItem === item.id ? (
                                                    <Minus size={18} className="text-blue-400" />
                                                ) : (
                                                    <Plus size={18} className="text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent className="px-6 pb-5">
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-gray-700 text-base leading-relaxed">
                                            {item.content}
                                        </div>
                                        
                                   {/* Feedback and copy buttons */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                            {/* Feedback */}
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 text-sm">Was this helpful?</span>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => setFeedback({...feedback, [item.id]: 'helpful'})}
                                                        className={`p-1.5 rounded-full transition-colors ${
                                                            feedback[item.id] === 'helpful' 
                                                                ? 'bg-green-500 text-white' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <ThumbsUp size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setFeedback({...feedback, [item.id]: 'not-helpful'})}
                                                        className={`p-1.5 rounded-full transition-colors ${
                                                            feedback[item.id] === 'not-helpful' 
                                                                ? 'bg-red-500 text-white' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <ThumbsDown size={14} />
                                                    </button>
                                                </div>
                                                {feedback[item.id] && (
                                                    <span className="text-xs text-gray-400">
                                                        Thank you for your feedback!
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Copy button */}
                                            <button
                                                onClick={() => handleCopy(item.content, item.id)}
                                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                                            >
                                                {copied === item.id ? (
                                                    <>
                                                        <Check size={14} className="text-green-500" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={14} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Define the items array with proper typing
const items: FAQItem[] = [
    {
        id: "1",
        title: "How does Maisha Care keep my health records secure?",
        content: "Maisha Care employs state-of-the-art blockchain technology and end-to-end encryption to ensure your health records remain completely secure. All data is encrypted before being stored on the blockchain, and access is strictly controlled through multi-factor authentication. Our security protocols exceed industry standards and are regularly audited by independent security experts.",
        category: "security",
        details: [
            "End-to-end encryption protects all your medical data",
            "Blockchain technology prevents unauthorized alterations",
            "Multi-factor authentication for accessing sensitive information"
        ],
        resources: [
            { label: "Security Whitepaper", url: "#security-whitepaper" },
            { label: "Encryption Standards", url: "#encryption-standards" }
        ]
    },
    {
        id: "2",
        title: "How quickly can I access my medical records?",
        content: "With Maisha Care, you can access your medical records instantly, 24/7. Our blockchain-based system ensures your records are always available when you need them, whether you're at home or traveling. The platform provides immediate access through our secure mobile app or web interface.",
        category: "access",
        details: [
            "24/7 instant access to your records",
            "Mobile and web platform availability",
            "Offline access capabilities"
        ]
    },
    {
        id: "3",
        title: "Who controls my medical data?",
        content: "You have complete control over your medical data. You decide who can access your records and for how long. Healthcare providers can only view your records with your explicit permission, and you can revoke access at any time. Our blockchain technology ensures all access attempts are recorded and transparent.",
        category: "control",
        details: [
            "Full control over data access permissions",
            "Transparent access logging",
            "Revocable access rights"
        ]
    },
    {
        id: "4",
        title: "How do healthcare providers interact with Maisha Care?",
        content: "Healthcare providers can seamlessly integrate with Maisha Care through our secure API and dedicated provider portal. They can request access to patient records, update medical information, and collaborate with other providers - all with patient consent and complete transparency.",
        category: "providers",
        details: [
            "Secure provider portal",
            "Real-time collaboration tools",
            "Integrated appointment management"
        ]
    },
    {
        id: "5",
        title: "What role does AI play in Maisha Care?",
        content: "Our AI technology analyzes medical data to provide predictive insights, identify potential health risks, and suggest preventive measures. The AI assists healthcare providers in making more informed decisions while ensuring patient privacy and data security remain paramount.",
        category: "ai",
        details: [
            "Predictive health analytics",
            "AI-assisted diagnosis support",
            "Personalized health recommendations"
        ]
    },
    {
        id: "6",
        title: "How is patient privacy maintained?",
        content: "Patient privacy is our top priority. All data is encrypted using military-grade encryption, and our blockchain technology ensures that only authorized parties can access specific portions of your medical records. We comply with all major healthcare privacy regulations and standards.",
        category: "security",
        details: [
            "Military-grade encryption",
            "Regulatory compliance",
            "Granular privacy controls"
        ]
    },
    {
        id: "7",
        title: "Can I share my medical records with multiple doctors?",
        content: "Yes, you can easily share your medical records with multiple healthcare providers through Maisha Care. Our platform allows you to grant and manage access permissions for different providers, ensuring seamless collaboration while maintaining security.",
        category: "control",
        details: [
            "Multiple provider access management",
            "Temporary access grants",
            "Access history tracking"
        ]
    },
    {
        id: "8",
        title: "How does the AI assist in medical diagnosis?",
        content: "Our AI system analyzes patterns in medical data to assist healthcare providers in making more accurate diagnoses. It can identify potential health issues early, suggest relevant tests, and provide evidence-based treatment recommendations, all while working alongside human medical expertise.",
        category: "ai",
        details: [
            "Pattern recognition in medical data",
            "Early warning system",
            "Treatment optimization suggestions"
        ]
    }
];

export default FAQs;