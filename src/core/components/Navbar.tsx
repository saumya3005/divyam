"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // To avoid hydration mismatch since Zustand persist reads from localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-wider text-white">DIVYAM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname === "/" ? "text-white" : "text-brand-gray"}`}
            >
              Home
            </Link>
            <Link 
              href="/#about" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname === "/#about" ? "text-white" : "text-brand-gray"}`}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname?.startsWith("/services") ? "text-white" : "text-brand-gray"}`}
            >
              Services
            </Link>
            <Link 
              href="/events" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname?.startsWith("/events") ? "text-white" : "text-brand-gray"}`}
            >
              Events
            </Link>
            <Link 
              href="/gallery" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname?.startsWith("/gallery") ? "text-white" : "text-brand-gray"}`}
            >
              Gallery
            </Link>
            <Link 
              href="/#contact" 
              className={`text-sm font-medium transition-colors hover:text-white ${pathname === "/#contact" ? "text-white" : "text-brand-gray"}`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/login"
                  className="text-sm font-medium text-brand-gray hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="text-sm font-medium bg-brand-gold text-brand-dark px-5 py-2.5 rounded-xl hover:bg-brand-gold/90 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href={user?.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
                  className="text-sm font-medium text-brand-gold hover:text-brand-gold/80 transition-colors"
                >
                  {user?.role === "admin" ? "Admin Panel" : "Customer Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-red-400 transition-colors ml-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
