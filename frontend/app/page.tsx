'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from 'lucide-react'
import { Andre,Steph ,Wambugu,Logo, Dashboard } from "@/constants/img"
import Button from "@/components/ui/button"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#ff6f91] text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src={Logo} 
              alt="Maisha Care Logo" 
              width={80} 
              height={80} 
            />
            <span className="text-2xl font-bold">Maisha Care</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="hover:text-gray-200">Features</Link>
            <Link href="#about" className="hover:text-gray-200">About</Link>
            <Link href="#team" className="hover:text-gray-200">Team</Link>
            <Link href="#contact" className="hover:text-gray-200">Contact</Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-[#ff6f91] py-4">
            <nav className="flex flex-col items-center space-y-4">
              <Link href="#features" className="text-white hover:text-gray-200">Features</Link>
              <Link href="#about" className="text-white hover:text-gray-200">About</Link>
              <Link href="#team" className="text-white hover:text-gray-200">Team</Link>
              <Link href="#contact" className="text-white hover:text-gray-200">Contact</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#ff6f91] text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Maisha Care: Empowering You with Decentralized Healthcare Records
                </h1>
                <p className="text-xl mb-8">
                  Your Health, Your Data, Your Control
                </p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <Link href="/login" className="bg-white text-[#ff6f91] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
                    Get Started
                  </Link>
                  <Link href="#features" className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#ff6f91] transition duration-300">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                  <Image
                    src={Dashboard}
                    alt="Maisha Care Dashboard"
                    width={600}
                    height={400}
                    className="rounded-xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#ff6f91] text-white rounded-full p-4 inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p>Your health records are encrypted and stored securely on the blockchain.</p>
              </div>
              <div className="text-center">
                <div className="bg-[#ff6f91] text-white rounded-full p-4 inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
                <p>Access your health records anytime, anywhere, with just a few clicks.</p>
              </div>
              <div className="text-center">
                <div className="bg-[#ff6f91] text-white rounded-full p-4 inline-block mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Ownership</h3>
                <p>You have full control over who can access your health information.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image src="/placeholder.svg" alt="About Maisha Care" width={500} height={300} className="rounded-lg shadow-lg" />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold mb-6">About Maisha Care</h2>
                <p className="text-lg mb-6">
                  Maisha Care is revolutionizing healthcare data management through blockchain technology. We empower patients with control over their health records while facilitating seamless collaboration between healthcare providers.
                </p>
                <Link href="#contact" className="bg-[#ff6f91] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#ff5f81] transition duration-300">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Image src={Andre} alt="Andre" width={200} height={200} className="rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Andre Aila</h3>
                <p className="text-gray-600">Cofounder, Business Development and Product Manager</p>
              </div>
              <div className="text-center">
                <Image src={Wambugu} alt="Wambugu" width={200} height={200} className="rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Wambugu Gichuki</h3>
                <p className="text-gray-600">Cofounder, Tech Lead, Smart Contract Engineer and Data Scientist</p>
              </div>
              <div className="text-center">
                <Image src={Steph} alt="Stephanie" width={200} height={200} className="rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stephanie Ndung&apos;u</h3>
                <p className="text-gray-600">Medical Doctor and Lead Medical Advisor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-br from-gray-100 to-gray-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Contact Us</h2>
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-700">We'd love to hear from you</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input type="text" id="name" name="name" placeholder="John Doe" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input type="email" id="email" name="email" placeholder="johndoe@example.com" className="pl-10" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                  <div className="relative">
                    <MessageSquareIcon className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <Textarea id="message" name="message" placeholder="Your message here..." className="pl-10 min-h-[120px]" required />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#ff6f91] to-[#ff5f81] hover:from-[#ff5f81] hover:to-[#ff4f71] text-white font-semibold py-3 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ff6f91] focus:ring-opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <SendIcon className="mr-2 h-5 w-5" /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Maisha Care. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}