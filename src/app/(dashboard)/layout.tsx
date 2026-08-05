"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { 
  LayoutDashboard, 
  Ticket, 
  CreditCard, 
  Settings, 
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Bookings", href: "/dashboard/bookings", icon: Ticket },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsMounted(true);
    const token = localStorage.getItem("auth_token");
    if (!token && !isAuthenticated) {
      router.push("/login?role=customer");
    }
  }, [isAuthenticated, router]);

  if (!isMounted) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
          <Link href="/dashboard" className="text-xl font-bold tracking-wider text-brand-gold">
            DIVYAM
          </Link>
          <button className="lg:hidden text-brand-gray hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          <div className="text-xs font-semibold text-brand-gray uppercase tracking-wider px-3 mb-2 mt-4">Customer Portal</div>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-brand-gold/10 text-brand-gold" 
                    : "text-brand-gray hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={18} className={isActive ? "text-brand-gold" : "opacity-70"} />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-brand-gray hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <Search size={18} />
            <span className="font-medium text-sm">Browse Services</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-brand-gray hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-bg-base/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-brand-gray hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-brand-gray hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Bell size={20} />
            </button>
            
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">{user?.firstName || "Customer"}</div>
                <div className="text-xs text-brand-gray capitalize">{user?.role || "Customer"}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/30 font-semibold">
                {user?.firstName?.charAt(0) || "C"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
