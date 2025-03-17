'use client';
import { Clock, MessageSquare, Stethoscope, ArrowRight, Shield, CheckCircle, User, Calendar, Bell, Activity, Heart, ChevronRight, DollarSign, Star, Zap } from 'lucide-react';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function PatientsPage() {
  const router = useRouter();
  
  // Function to navigate to consultation page
  const navigateToConsultation = () => {
    router.push('/consultation');
  };

  // Function to navigate to login page
  const navigateToLogin = () => {
    router.push('/patients/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-color1/5 via-white to-color1/5 pt-24"
    >
      <NavBar />
      
      {/* Hero Section - Enhanced with better visual hierarchy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-r from-color1 to-color1/80 overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-6 md:p-12 text-white">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6"
              >
                <Zap className="w-4 h-4 mr-2 text-yellow-300" />
                <span className="text-sm font-medium text-white">Blockchain-Powered Healthcare</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Expert Medical Care in <span className="text-color3 relative">
                  Under 10 Minutes
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-color3/30 rounded-full"></span>
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-lg"
              >
                Experience next-generation healthcare with AI-assisted diagnoses and instant access to qualified doctors.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button 
                  onClick={navigateToConsultation}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-color1 rounded-full font-medium hover:bg-gray-100 transition-all hover:shadow-lg"
                >
                  Start Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </button>
                <button 
                  onClick={navigateToLogin}
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white/10 transition-all"
                >
                  Patient Login <User className="ml-2 w-4 h-4" />
                </button>
              </motion.div>
            </div>
            <div className="md:w-2/5 bg-color1/90 p-6 md:p-0 flex items-center justify-center relative overflow-hidden">
              {/* Abstract background elements */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-color3 blur-md"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/50 blur-sm"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-color1/50 blur-md"></div>
              </motion.div>
              
              {/* Card with doctor availability */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="bg-white rounded-2xl p-6 shadow-2xl relative z-10 max-w-xs w-full backdrop-blur-sm border border-white/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Next Available</h3>
                    <p className="text-sm text-gray-500">Doctor consultation</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 flex items-center">
                  2 min
                  <span className="ml-2 text-sm font-normal text-green-500 bg-green-100 px-2 py-1 rounded-full">Available Now</span>
                </div>
                <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-xl">
                  <div className="w-12 h-12 bg-color1/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-color1" />
                  </div>
                  <div>
                    <div className="font-medium">Dr. Sarah K.</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online now
                    </div>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl mb-4">
                  <p className="text-gray-600 mb-1 text-sm">Need immediate care?</p>
                  <button 
                    onClick={navigateToConsultation}
                    className="inline-flex items-center text-color1 font-medium text-sm"
                  >
                    Start AI Consultation <ArrowRight className="ml-1 w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={navigateToConsultation}
                  className="w-full bg-color1 text-white py-3 rounded-xl font-medium hover:bg-color1/90 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Connect Now
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section - Enhanced with better animations and visual elements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-color1/10 rounded-full text-color1 font-medium text-sm mb-4">Simple Process</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-color4">How Maisha Care Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain-powered platform connects you with doctors in three simple steps
          </p>
        </motion.div>

        {/* Process Flow - Enhanced with better visuals */}
        <div className="relative">
          {/* Connection line - Removing this */}
          
          {/* Process steps */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16 relative z-10"
          >
            {[
              {
                icon: MessageSquare,
                title: "Describe Symptoms",
                description: "Share your symptoms and medical history through our secure platform",
                time: "2 minutes",
                color: "bg-blue-500"
              },
              {
                icon: Shield,
                title: "AI Analysis",
                description: "Our AI system analyzes your symptoms and medical records for preliminary assessment",
                time: "30 seconds",
                color: "bg-purple-500"
              },
              {
                icon: Stethoscope,
                title: "Doctor Review",
                description: "A qualified doctor reviews your case and provides personalized treatment",
                time: "5-7 minutes",
                color: "bg-green-500"
              }
            ].map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all h-full border border-gray-100 hover:border-color1/20 group">
                  <div className="relative">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-white transform group-hover:rotate-3 transition-transform`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    {/* Removing the numbering */}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center group-hover:text-color1 transition-colors">{step.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{step.description}</p>
                  <div className="text-center text-color1 font-medium flex items-center justify-center gap-2 bg-color1/5 py-2 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>{step.time}</span>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <ChevronRight className="w-8 h-8 text-color1" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Total Time Banner - Enhanced with better visuals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-color1 to-color1/80 rounded-xl p-6 md:p-8 text-white text-center mb-16 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Clock className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">Total Time: Less than 10 minutes from symptoms to treatment</h3>
          </div>
        </motion.div>
      </section>

      {/* Key Benefits Section - Enhanced with better card design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-10 mb-16 relative overflow-hidden border border-gray-100"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-color1/10 rounded-full -mr-32 -mt-32 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-color1/5 rounded-full -ml-32 -mb-32 opacity-70"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 bg-color1/10 rounded-full text-color1 font-medium text-sm mb-4">Why Choose Us</span>
              <h2 className="text-3xl font-bold text-color4">Why Patients Choose Maisha Care</h2>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
            >
              {[
                {
                  icon: Clock,
                  title: "Quick Consultations",
                  description: "Get diagnosed and receive prescriptions in under 10 minutes",
                  color: "bg-blue-500"
                },
                {
                  icon: Shield,
                  title: "Secure Blockchain Records",
                  description: "Your medical data is encrypted and stored securely on blockchain technology",
                  color: "bg-green-500"
                },
                {
                  icon: Stethoscope,
                  title: "Expert Doctors",
                  description: "Access to qualified healthcare professionals 24/7",
                  color: "bg-purple-500"
                },
                {
                  icon: Bell,
                  title: "Medicine Reminders",
                  description: "Never miss a dose with our smart medication reminder system",
                  color: "bg-orange-500"
                },
                {
                  icon: Activity,
                  title: "Health Monitoring",
                  description: "Track your vital signs and health progress over time",
                  color: "bg-red-500"
                },
                {
                  icon: Heart,
                  title: "Preventive Care",
                  description: "Get personalized health tips and preventive care recommendations",
                  color: "bg-pink-500"
                }
              ].map((benefit, index) => (
                <motion.div key={index} variants={itemVariants} className="flex gap-4 group">
                  <div className={`${benefit.color} p-3 rounded-xl h-fit text-white shadow-md transform group-hover:rotate-3 transition-all`}>
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-color1 transition-colors">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section - Enhanced with better card design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: "$2", label: "Consultation Fee", icon: DollarSign, color: "bg-green-500" },
              { number: "8 min", label: "Average Consultation", icon: Clock, color: "bg-blue-500" },
              { number: "24/7", label: "Service Availability", icon: Calendar, color: "bg-purple-500" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center border border-gray-100 hover:border-color1/20 group"
              >
                <div className={`${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white transform group-hover:rotate-3 transition-all`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-color1 transition-colors">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section - Enhanced with better visuals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-color1 to-color1/80 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-color1/30 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-color1/80 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
          </div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Ready for a New Healthcare Experience?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
            >
              Join thousands of satisfied patients who trust Maisha Care for their healthcare needs.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
            >
              <button 
                onClick={navigateToConsultation}
                className="bg-white text-color1 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg flex-1 w-full flex items-center justify-center gap-2 hover:shadow-xl"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start AI Consultation
              </button>
              <button 
                onClick={navigateToLogin}
                className="bg-transparent border border-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all w-full flex-1 text-white flex items-center justify-center"
              >
                <User className="mr-2 h-5 w-5" />
                Patient Login
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                </div>
                <span className="text-white">No waiting rooms</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                </div>
                <span className="text-white">No appointments</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                </div>
                <span className="text-white">Start in seconds</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      <Footer />
    </motion.div>
  );
}