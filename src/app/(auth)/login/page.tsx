"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <motion.div
        key="role-selection"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-light text-white mb-2">Welcome Back</h1>
          <p className="text-brand-gray">Select your portal to continue</p>
        </div>

        <Link
          href="/login/customer"
          className="group bg-brand-surface border border-white/10 hover:border-brand-gold/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/5"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCircle2 className="w-8 h-8 text-brand-gray group-hover:text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium text-white mb-1">CUSTOMER LOGIN</h2>
            <p className="text-sm text-brand-gray">Manage your bookings and profile</p>
          </div>
        </Link>

        <Link
          href="/login/admin"
          className="group bg-brand-surface border border-white/10 hover:border-brand-gold/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all hover:bg-brand-gold/5"
        >
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-8 h-8 text-brand-gold" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-medium text-white mb-1">ADMIN LOGIN</h2>
            <p className="text-sm text-brand-gray">Access the management dashboard</p>
          </div>
        </Link>
        
        <p className="text-center mt-4 text-sm text-brand-gray">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-gold hover:underline">
            Request access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
