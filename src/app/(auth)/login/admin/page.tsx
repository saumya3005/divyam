"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  role: z.literal("admin"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "admin"
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex flex-col"
      >
        <div className="mb-8 relative">
          <Link 
            href="/login"
            className="absolute -left-2 top-0 p-2 text-brand-gray hover:text-white transition-colors"
            title="Back to role selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-light text-white mb-2">
              Admin Login
            </h1>
            <p className="text-brand-gray">Enter your credentials to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-brand-gray ml-1">Email Address</label>
            <input
              {...register("email")}
              type="email"
              className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              placeholder="admin@divyam.com"
            />
            {errors.email && (
              <span className="text-xs text-red-400 ml-1">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-brand-gray ml-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-xs text-red-400 ml-1">{errors.password.message}</span>
            )}
          </div>

          <div className="flex justify-between items-center px-1 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-brand-surface text-brand-gold focus:ring-brand-gold/50" />
              <span className="text-sm text-brand-gray">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-brand-gold hover:text-brand-gold/80 transition-colors">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoggingIn}
            type="submit"
            className="font-medium rounded-xl py-3.5 mt-2 flex justify-center items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed bg-brand-gold text-brand-dark hover:bg-brand-gold/90"
          >
            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
