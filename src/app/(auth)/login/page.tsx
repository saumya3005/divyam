"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Welcome Back</h1>
        <p className="text-brand-gray">Sign in to manage your premium events</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-brand-gray ml-1">Email Address</label>
          <input
            {...register("email")}
            type="email"
            className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all"
            placeholder="name@company.com"
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
          className="bg-brand-gold text-brand-dark font-medium rounded-xl py-3.5 mt-2 flex justify-center items-center gap-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </motion.button>
      </form>

      <p className="text-center mt-8 text-sm text-brand-gray">
        Don't have an account?{" "}
        <Link href="/register" className="text-brand-gold hover:underline">
          Request access
        </Link>
      </p>
    </div>
  );
}
