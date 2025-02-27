import { Stethoscope, Clock, Wallet,ArrowRight, Calendar, ChevronRight, BellRing } from 'lucide-react';
import NavBar from '@/components/shared/NavBar';
import Footer from '@/components/shared/Footer';

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-color1/5 to-white pt-24">
      <NavBar />
      
      {/* Hero Section with Earnings Focus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-color1 to-color1/80 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/5 p-6 md:p-12 text-white">
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-1 mb-6">
                <span className="text-sm font-medium text-white">For Medical Professionals</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Earn <span className="text-color3">150,000 KSh</span> Monthly With Blockchain Healthcare
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                     Join Kenya&apos;s fastest-growing healthcare platform and maximize your earning potential while delivering seamless patient care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="bg-white text-color1 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-color1/10 hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2 group">
                  Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium flex items-center animate-pulse">
                  <BellRing className="w-5 h-5 mr-2" /> Only 2 spots remaining
                </div>
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
                    <h3 className="font-bold text-gray-900">Monthly Earnings</h3>
                    <p className="text-sm text-gray-500">Average doctor</p>
                  </div>
                  <Wallet className="w-8 h-8 md:w-10 md:h-10 text-color1" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-color1 mb-2">150,000 KSh</div>
                <div className="h-2 bg-gray-100 rounded-full mb-4">
                  <div className="h-2 bg-color1 rounded-full w-4/5"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Top performers: 200,000+ KSh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Practice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-color4">
          Streamlined Patient Management
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-color1 group">
            <Stethoscope className="w-12 h-12 text-color1 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-3 text-color4">Focus on Patients</h3>
            <p className="text-color1">
              Our blockchain-based system eliminates paperwork and administrative burdens, letting you focus entirely on patient care.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-color1 group">
            <Clock className="w-12 h-12 text-color1 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-3 text-color4">24-Hour Onboarding</h3>
            <p className="text-color1">
              Get verified and start seeing patients within 24 hours. Our streamlined process means no complex setup or technical knowledge required.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-color1 group">
            <Calendar className="w-12 h-12 text-color1 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-3 text-color4">Flexible Scheduling</h3>
            <p className="text-color1">
              Work when you want. Set your own hours and availability while our platform keeps your schedule optimized and your calendar full.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Onboarding Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-color4">
          Get Started in Just 3 Simple Steps
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Complete Application",
              description: "Fill out our simple online form with your professional details.",
              time: "5 minutes"
            },
            {
              step: "2",
              title: "Quick Verification",
              description: "Our team verifies your credentials and medical license.",
              time: "Within 24 hours"
            },
            {
              step: "3",
              title: "Start Earning",
              description: "Begin seeing patients and receiving payments through our secure platform.",
              time: "Immediately after approval"
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-8 shadow-lg z-10 relative h-full border border-color1/20">
                <div className="w-12 h-12 rounded-full bg-color1 text-white flex items-center justify-center font-bold text-xl mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-color4">{step.title}</h3>
                <p className="text-color1 mb-4">
                  {step.description}
                </p>
                <div className="text-sm text-color1 font-medium">
                  Time: {step.time}
                </div>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-0">
                  <ChevronRight className="w-8 h-8 text-color1" />
                </div>
              )}
            </div>
          ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Medical Practice?</h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join over 100 doctors who are already earning more while providing better patient care through Maisha Care&apos;s blockchain technology.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
              <button className="bg-white text-color1 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-color1/10 hover:text-white transition-colors shadow-lg flex-1 w-full">
                Apply to Join Maisha Care
              </button>
              <button className="bg-transparent border border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors w-full flex-1 text-white">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}