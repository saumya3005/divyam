"use client";

import Link from "next/link";
import { ShieldCheck, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      {/* Navbar (Minimal) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <span className="text-2xl font-bold tracking-wider text-white">DIVYAM</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Welcome to <span className="font-medium text-brand-gold">Divyam</span>
          </h1>
          <p className="text-brand-gray text-lg max-w-xl mx-auto">
            Select your portal to proceed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Admin Panel Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-brand-surface border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:border-brand-gold/30 transition-all group"
          >
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-medium text-white mb-4">Admin Panel</h2>
            <p className="text-brand-gray mb-8 flex-1">
              Manage the complete business.<br/><br/>
              <span className="text-sm opacity-80">
                Bookings • Customers • Employees • Inventory<br/>
                Reports • Settings • Approvals • Dashboard
              </span>
            </p>
            <Link 
              href="/login?role=admin"
              className="w-full py-3.5 bg-white/5 hover:bg-brand-gold hover:text-brand-dark text-white rounded-xl font-medium transition-all"
            >
              Admin Login
            </Link>
          </motion.div>

          {/* Customer Panel Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-brand-surface border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:border-brand-gold/30 transition-all group"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserCircle2 className="w-8 h-8 text-brand-gray group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-medium text-white mb-4">Customer Panel</h2>
            <p className="text-brand-gray mb-8 flex-1">
              Customers can access their booking related features.<br/><br/>
              <span className="text-sm opacity-80">
                My Bookings • Payments • Profile • Settings
              </span>
            </p>
            <Link 
              href="/login?role=customer"
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all"
            >
              Customer Login
            </Link>
          </motion.div>
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-brand-gray text-sm z-10 mt-auto">
        © {new Date().getFullYear()} Divyam Platform. All rights reserved.
      </footer>
    </div>
  );
}