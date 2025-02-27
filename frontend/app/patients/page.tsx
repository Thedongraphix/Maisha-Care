import { Clock, MessageSquare, Stethoscope, ArrowRight,Shield, CheckCircle, User, Calendar, Bell, Activity, Heart, ChevronRight, Phone, DollarSign } from 'lucide-react';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-color1/5 to-white pt-24">
      <NavBar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-color1 to-color1/80 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-6 md:p-12 text-white">
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-1 mb-6">
                <span className="text-sm font-medium text-white">Blockchain-Powered Healthcare</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Expert Medical Care in <span className="text-color3">Under 10 Minutes</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Experience next-generation healthcare with AI-assisted diagnoses and instant access to qualified doctors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="bg-white text-color1 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-color1/10 transition-colors shadow-lg flex items-center justify-center gap-2 group">
                  Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium flex items-center justify-center">
                  How It Works
                </button>
              </div>
            </div>
            <div className="md:w-2/5 bg-color1/90 p-6 md:p-0 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-color3"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/50"></div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-2xl relative z-10 max-w-xs w-full">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Next Available</h3>
                    <p className="text-sm text-gray-500">Doctor consultation</p>
                  </div>
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-color1" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">2 min</div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-color1/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-color1" />
                  </div>
                  <div>
                    <div className="font-medium">Dr. Sarah K.</div>
                    <div className="text-sm text-gray-500">Online now</div>
                  </div>
                </div>
                <button className="w-full bg-color1 text-white py-2 rounded-lg font-medium hover:bg-color1/90 transition-colors">
                  Connect Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-color4">How Maisha Care Works</h2>
          <p className="text-lg md:text-xl text-color1 max-w-2xl mx-auto">
            Our blockchain-powered platform connects you with doctors in three simple steps
          </p>
        </div>

        {/* Process Flow */}
        <div className="relative">
          <div className="hidden md:block absolute top-24 left-1/5 right-1/5 h-2 bg-color1/10 z-0">
            <div className="h-2 bg-color1/30 w-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative z-10">
            {[
              {
                icon: MessageSquare,
                title: "Describe Symptoms",
                description: "Share your symptoms and medical history through our secure platform",
                time: "2 minutes"
              },
              {
                icon: Shield,
                title: "AI Analysis",
                description: "Our AI system analyzes your symptoms and medical records for preliminary assessment",
                time: "30 seconds"
              },
              {
                icon: Stethoscope,
                title: "Doctor Review",
                description: "A qualified doctor reviews your case and provides personalized treatment",
                time: "5-7 minutes"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <div className="w-16 h-16 bg-color1/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <step.icon className="w-8 h-8 text-color1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{step.description}</p>
                  <div className="text-center text-color1 font-medium flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{step.time}</span>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <ChevronRight className="w-8 h-8 text-color1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Time Banner */}
        <div className="bg-gradient-to-r from-color1 to-color1/80 rounded-xl p-4 md:p-6 text-white text-center mb-16 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Clock className="w-8 h-8 md:w-10 md:h-10" />
            <h3 className="text-xl md:text-2xl font-bold">Total Time: Less than 10 minutes from symptoms to treatment</h3>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-color1/10 rounded-full -mr-32 -mt-32 opacity-70"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12">Why Patients Choose Maisha Care</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {[
                {
                  icon: Clock,
                  title: "Quick Consultations",
                  description: "Get diagnosed and receive prescriptions in under 10 minutes"
                },
                {
                  icon: Shield,
                  title: "Secure Blockchain Records",
                  description: "Your medical data is encrypted and stored securely on blockchain technology"
                },
                {
                  icon: Stethoscope,
                  title: "Expert Doctors",
                  description: "Access to qualified healthcare professionals 24/7"
                },
                {
                  icon: Bell,
                  title: "Medicine Reminders",
                  description: "Never miss a dose with our smart medication reminder system"
                },
                {
                  icon: Activity,
                  title: "Health Monitoring",
                  description: "Track your vital signs and health progress over time"
                },
                {
                  icon: Heart,
                  title: "Preventive Care",
                  description: "Get personalized health tips and preventive care recommendations"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="bg-color1/10 p-3 rounded-full h-fit group-hover:bg-color1/20 transition-colors">
                    <benefit.icon className="w-8 h-8 text-color1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              quote: "Maisha Care saved me when I needed urgent medical advice at 2 AM. The doctor was professional and solved my issue in minutes.",
              name: "James Kimani",
              location: "Nairobi"
            },
            {
              quote: "I love how I can access my complete medical history anytime. The blockchain technology makes me feel secure about my sensitive data.",
              name: "Sarah Ochieng",
              location: "Mombasa"
            },
            {
              quote: "As someone living in a rural area, getting quick access to doctors used to be impossible. Maisha Care changed everything for me.",
              name: "David Mwangi",
              location: "Nakuru"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-color3" fill="#FBBF24" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-color1/10 rounded-full flex items-center justify-center text-color1 font-bold mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
     */}
      {/* Statistics Section */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10 flex justify-center items-center">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {[
            { number: "2", label: "Consultation Fee", icon: DollarSign },
            { number: "8 min", label: "Average Consultation", icon: Clock },
            { number: "24/7", label: "Service Availability", icon: Calendar }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <stat.icon className="w-10 h-10 text-color1 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-color1 to-color1/80 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-color1/30 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-color1/80 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready for a New Healthcare Experience?</h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied patients who trust Maisha Care for their healthcare needs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
              <button className="bg-white text-color1 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-color1/10 hover:text-white transition-colors shadow-lg flex-1 w-full flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Get Started Now
              </button>
              <button className="bg-transparent border border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors w-full flex-1 text-white">
                Learn More
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-8">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-white">No waiting rooms. No appointments. Start in seconds.</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}