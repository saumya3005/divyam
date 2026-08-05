"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["customer", "admin"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "customer" | "admin") || "customer";
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: defaultRole }
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (searchParams.get("role")) {
      setValue("role", searchParams.get("role") as "customer" | "admin");
    }
  }, [searchParams, setValue]);

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
        
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-sm text-brand-gray ml-1">Login As</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${selectedRole === 'customer' ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 bg-brand-surface text-brand-gray hover:border-white/20'}`}>
              <input type="radio" value="customer" {...register("role")} className="hidden" />
              <span className="font-medium text-sm">Customer</span>
            </label>
            <label className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${selectedRole === 'admin' ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/10 bg-brand-surface text-brand-gray hover:border-white/20'}`}>
              <input type="radio" value="admin" {...register("role")} className="hidden" />
              <span className="font-medium text-sm">Admin</span>
            </label>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
