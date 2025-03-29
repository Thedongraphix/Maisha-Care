import React from 'react'
import { Element } from 'react-scroll'
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Globe, 
  HeartPulse,
  PieChart,
  Users,
  Clock
} from "lucide-react";
import Image from 'next/image';

const Features = () => {
  return (
    <Element name="features" className="w-full bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-color1 to-color4 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Revolutionizing Healthcare Access
          </h2>
          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto font-medium">
            Maisha Care combines AI technology with human expertise to deliver personalized, accessible healthcare when you need it most.
          </p>
        </motion.div>

        {/* 3 Feature Cards in a row with larger size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-color1/10 to-color4/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-all duration-300"></div>
              
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-color1 to-color4 text-white mb-6">
                <feature.icon size={28} />
              </div>
              
              <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-800 group-hover:text-color1 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 font-DM text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced statistics section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-color1 to-color4 rounded-2xl shadow-xl text-white overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Left side heading with full white line */}
              <div className="lg:w-1/3 p-8 md:p-10 flex flex-col justify-center relative">
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFFFFF" d="M43.2,-68.1C57.4,-62.2,71.3,-53.2,78.9,-40.2C86.5,-27.1,87.8,-9.9,85.2,6.2C82.6,22.3,76.1,37.3,66.2,49.7C56.4,62.1,43.2,71.8,28.8,76.3C14.4,80.8,-1.3,80.1,-16.1,75.9C-30.9,71.7,-44.9,63.9,-56.5,53C-68.1,42,-77.5,27.9,-80.3,12.2C-83.1,-3.4,-79.3,-20.5,-71,-34.1C-62.8,-47.7,-49.9,-57.7,-36.3,-63.9C-22.7,-70.1,-8.4,-72.5,3.3,-77.5C14.9,-82.5,29,-74,43.2,-68.1Z" transform="translate(100 100)" />
                  </svg>
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold mb-5">Why users love <br/>Maisha Care</h3>
                <div className="h-1 w-20 bg-white mb-5"></div>
                <p className="text-white/90 leading-relaxed">Experience healthcare that's personalized, accessible, and always available when you need it.</p>
              </div>
              
              {/* Stats section - improved with animations and graphics */}
              <div className="lg:w-2/3 bg-white/10 backdrop-blur-sm p-8 md:p-12 flex flex-wrap items-center">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="w-1/2 lg:w-1/4 p-4 text-center relative group"
                  >
                    {/* Background circle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-24 h-24 rounded-full bg-white/5 group-hover:scale-110 transition-all duration-500"></div>
                    </div>
                    
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center z-10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <stat.icon size={28} className="text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Value with counter animation */}
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold mb-1 relative z-10"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        delay: index * 0.2 + 0.3 
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    
                    {/* Label */}
                    <div className="text-xs uppercase tracking-wider text-white/80 font-medium relative z-10">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Bottom decorative waves */}
            <div className="h-6 bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Element>
  )
}

export default Features

// Reduced to 3 key features
const features = [
  {
    title: "AI-Powered Health Assistant",
    description:
      "Connect with our virtual health assistant for immediate symptom assessment, personalized health advice, and seamless referrals to specialists when needed.",
    icon: HeartPulse,
  },
  {
    title: "Secure Medical Records",
    description:
      "Your health data is encrypted and securely stored, ensuring complete privacy while allowing you to access your medical history anytime, anywhere.",
    icon: ShieldCheck,
  },
  {
    title: "Global Healthcare Access",
    description:
      "Access quality healthcare regardless of your location through our multi-platform service available via web, mobile, and WhatsApp.",
    icon: Globe,
  },
];

// Stats with icons for the horizontally aligned statistics section
const stats = [
  {
    value: "24/7",
    label: "Support",
    icon: Clock,
  },
  {
    value: "98%",
    label: "Satisfaction",
    icon: PieChart,
  },
  {
    value: "5k+",
    label: "Users",
    icon: Users,
  },
  {
    value: "15+",
    label: "Countries",
    icon: Globe,
  },
];