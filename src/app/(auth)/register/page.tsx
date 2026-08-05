"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAction, isRegistering } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerAction(data);
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Create Account</h1>
        <p className="text-brand-gray">Join the premium event management platform</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm text-brand-gray ml-1">First Name</label>
            <input
              {...register("firstName")}
              type="text"
              className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all w-full"
              placeholder="John"
            />
            {errors.firstName && (
              <span className="text-xs text-red-400 ml-1">{errors.firstName.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm text-brand-gray ml-1">Last Name</label>
            <input
              {...register("lastName")}
              type="text"
              className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all w-full"
              placeholder="Doe"
            />
            {errors.lastName && (
              <span className="text-xs text-red-400 ml-1">{errors.lastName.message}</span>
            )}
          </div>
        </div>

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

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isRegistering}
          type="submit"
          className="bg-brand-gold text-brand-dark font-medium rounded-xl py-3.5 mt-2 flex justify-center items-center gap-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </motion.button>
      </form>

      <p className="text-center mt-8 text-sm text-brand-gray">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-gold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
