"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/core/components/Navbar";
import { ArrowRight, Sparkles, Star, CalendarDays, Users, TrendingUp, CheckCircle2 } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans overflow-x-hidden text-white">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/20 rounded-full blur-[120px]" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px]" />
            </div>
            
            <motion.div 
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 0px 0px rgba(212, 175, 55, 0)", "0 0 40px 10px rgba(212, 175, 55, 0.3)", "0 0 0px 0px rgba(212, 175, 55, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-full border border-brand-gold/30 flex items-center justify-center bg-brand-gold/5"
              >
                <Sparkles className="w-10 h-10 text-brand-gold" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl tracking-[0.2em] font-light text-brand-gold">
                DIVYAM
              </h1>
              <motion.div 
                className="h-px bg-linear-to-r from-transparent via-brand-gold to-transparent mt-8 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex flex-col min-h-screen relative"
          >
            <div className="relative z-50">
              <Navbar />
            </div>

            {/* Premium Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 pt-20">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-125 h-125 bg-brand-gold/5 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-brand-gold/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover bg-center" />
                <div className="absolute inset-0 bg-linear-to-b from-bg-base via-bg-base/95 to-bg-base" />
              </div>
              <div className="w-full max-w-5xl mx-auto text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
                  <span className="inline-block px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-sm font-medium tracking-wide mb-8">
                    PREMIUM EVENT MANAGEMENT
                  </span>
                </motion.div>
                
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
                  Create Unforgettable Events <br className="hidden md:block"/>
                  <span className="font-medium text-brand-gold italic">With Divyam</span>
                </motion.h1>
                
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-brand-gray text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
                  Premium event booking and management platform. We bring your vision to life with luxury, precision, and elegance.
                </motion.p>
                
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-dark rounded-full font-medium transition-all hover:bg-brand-gold/90 hover:scale-105 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all hover:border-brand-gold/50 flex items-center justify-center">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Company Introduction */}
            <section id="about" className="py-24 relative z-10 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-light mb-6">Elevating Every Occasion to <span className="text-brand-gold italic">Art</span></h2>
                    <p className="text-brand-gray mb-6 leading-relaxed">
                      At Divyam, we believe that an event is not just a gathering, but a moment in time that deserves to be etched in memory forever. Our platform connects you with world-class venues, premium services, and elite event managers.
                    </p>
                    <p className="text-brand-gray leading-relaxed mb-8">
                      Whether you are hosting an intimate wedding, a massive corporate gala, or a private celebration, our end-to-end management system ensures flawless execution from concept to completion.
                    </p>
                    <ul className="space-y-4">
                      {["Exclusive Venues", "Dedicated Planners", "Seamless Booking Experience", "24/7 Premium Support"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-brand-gray">
                          <CheckCircle2 className="text-brand-gold w-5 h-5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative h-125 rounded-2xl overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-base/90 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Featured Services */}
            <section id="services" className="py-24 relative z-10 bg-brand-surface/30">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div {...fadeIn} className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-light mb-4">Featured <span className="text-brand-gold italic">Services</span></h2>
                  <p className="text-brand-gray max-w-2xl mx-auto">Discover our highly curated selection of premium event services tailored to perfection.</p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "Luxury Decor", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", desc: "Bespoke floral arrangements and premium ambient lighting." },
                    { title: "Gourmet Catering", img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80", desc: "Michelin-star equivalent dining experiences for your guests." },
                    { title: "Elite Entertainment", img: "https://images.unsplash.com/photo-1470229722913-7c092db62220?auto=format&fit=crop&w=800&q=80", desc: "World-class musicians, DJs, and performing artists." }
                  ].map((service, i) => (
                    <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.2 }} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-bg-base aspect-4/5">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${service.img}')` }} />
                      <div className="absolute inset-0 bg-linear-to-t from-bg-base via-bg-base/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-8">
                        <h3 className="text-2xl font-light mb-2">{service.title}</h3>
                        <p className="text-brand-gray text-sm mb-4">{service.desc}</p>
                        <Link href="/services" className="text-brand-gold text-sm font-medium hover:underline flex items-center gap-2">
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Why Choose Us & Statistics */}
            <section className="py-24 relative z-10 border-y border-white/5">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <motion.div {...fadeIn}>
                    <h2 className="text-3xl md:text-4xl font-light mb-6">Why <span className="text-brand-gold italic">Choose Us</span></h2>
                    <p className="text-brand-gray mb-10">We don't just plan events; we orchestrate masterpieces. Our commitment to excellence is reflected in our meticulous attention to detail and unwavering dedication to our clients' satisfaction.</p>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="border border-white/10 bg-brand-surface p-6 rounded-2xl text-center">
                        <CalendarDays className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                        <h4 className="text-3xl font-light text-white mb-1">500+</h4>
                        <p className="text-sm text-brand-gray">Events Hosted</p>
                      </div>
                      <div className="border border-white/10 bg-brand-surface p-6 rounded-2xl text-center">
                        <Users className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                        <h4 className="text-3xl font-light text-white mb-1">10k+</h4>
                        <p className="text-sm text-brand-gray">Happy Guests</p>
                      </div>
                      <div className="border border-white/10 bg-brand-surface p-6 rounded-2xl text-center">
                        <Star className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                        <h4 className="text-3xl font-light text-white mb-1">4.9/5</h4>
                        <p className="text-sm text-brand-gray">Average Rating</p>
                      </div>
                      <div className="border border-white/10 bg-brand-surface p-6 rounded-2xl text-center">
                        <TrendingUp className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                        <h4 className="text-3xl font-light text-white mb-1">99%</h4>
                        <p className="text-sm text-brand-gray">Success Rate</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div {...fadeIn} className="relative h-full min-h-100 rounded-2xl overflow-hidden border border-white/10">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center" />
                     <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay" />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 relative z-10 bg-brand-surface/30">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div {...fadeIn} className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-light mb-4">Client <span className="text-brand-gold italic">Testimonials</span></h2>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: "Sarah & James", role: "Wedding Couple", quote: "Divyam turned our dream wedding into reality. The attention to detail was absolutely flawless." },
                    { name: "Michael Chen", role: "Corporate Director", quote: "Our annual gala was elevated to new heights. The team's professionalism is unmatched in the industry." },
                    { name: "Emma Thompson", role: "Event Coordinator", quote: "The booking platform is seamless, and the on-ground execution was even better. Highly recommended." }
                  ].map((t, i) => (
                    <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.2 }} className="border border-white/10 bg-bg-base p-8 rounded-2xl relative">
                      <Star className="w-8 h-8 text-brand-gold/20 absolute top-8 right-8" />
                      <div className="flex text-brand-gold mb-6">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-brand-gray font-light italic mb-6">"{t.quote}"</p>
                      <div>
                        <h4 className="font-medium text-white">{t.name}</h4>
                        <p className="text-sm text-brand-gold">{t.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 relative z-10 border-t border-white/5">
              <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                <motion.div {...fadeIn}>
                  <h2 className="text-3xl md:text-4xl font-light mb-6">Ready to plan your <span className="text-brand-gold italic">next event?</span></h2>
                  <p className="text-brand-gray mb-10">Our luxury event specialists are ready to curate an unforgettable experience tailored exclusively to your vision.</p>
                  <Link href="/login" className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-medium transition-all hover:bg-brand-gold hover:text-black">
                    Book a Consultation <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Comprehensive Footer */}
            <footer className="pt-20 pb-10 border-t border-white/10 bg-brand-surface relative z-10">
              <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="md:col-span-1">
                  <h3 className="text-2xl tracking-widest font-light text-brand-gold mb-6">DIVYAM</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">The premier destination for luxury event planning, exclusive venue booking, and flawless execution.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-6">Quick Links</h4>
                  <ul className="space-y-3 text-sm text-brand-gray">
                    <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                    <li><Link href="#about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                    <li><Link href="/services" className="hover:text-brand-gold transition-colors">Services</Link></li>
                    <li><Link href="/events" className="hover:text-brand-gold transition-colors">Events</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-6">Support</h4>
                  <ul className="space-y-3 text-sm text-brand-gray">
                    <li><Link href="#contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
                    <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
                    <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-6">Contact Us</h4>
                  <ul className="space-y-3 text-sm text-brand-gray">
                    <li>contact@divyam.com</li>
                    <li>+1 (555) 123-4567</li>
                    <li>123 Luxury Avenue<br/>New York, NY 10001</li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-gray">
                <p>© {new Date().getFullYear()} Divyam Platform. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}