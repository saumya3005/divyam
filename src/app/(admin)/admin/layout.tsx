"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Ticket,
  Briefcase,
  PieChart,
  CreditCard,
  Calendar,
  DollarSign,
  Star,
  Menu,
  X,
  UserCog,
  Package,
  FileBarChart,
  ClipboardCheck
} from "lucide-react";

const ADMIN_NAV_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Ticket },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Employees", href: "/admin/employees", icon: UserCog },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { name: "Reports", href: "/admin/reports", icon: FileBarChart },
  { name: "Approvals", href: "/admin/approvals", icon: ClipboardCheck },
  { name: "Calendar", href: "/admin/calendar", icon: Calendar },
  { name: "Analytics", href: "/admin/analytics", icon: PieChart },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
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
    setIsMounted(true);
    const token = localStorage.getItem("auth_token");
    if (!token && !isAuthenticated) {
      router.push("/login?role=admin");
      return;
    }
    
    // Protect admin routes
    if (user && user.role !== "admin") {
      router.replace("/unauthorized"); // Redirect normal users
    }
  }, [isAuthenticated, user, router]);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-wider text-brand-gold flex items-center gap-2">
            DIVYAM <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md">ADMIN</span>
          </Link>
          <button className="lg:hidden text-brand-gray hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {ADMIN_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
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

        <div className="p-4 border-t border-white/5">
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
            
            <div className="hidden sm:flex items-center bg-brand-surface rounded-full px-4 py-2 border border-white/5 w-64 focus-within:border-brand-gold/50 transition-colors">
              <Search size={16} className="text-brand-gray mr-2" />
              <input 
                type="text" 
                placeholder="Search admin records..." 
                className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-brand-gray hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-bg-base" />
            </button>
            
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">{user?.firstName || "Admin"}</div>
                <div className="text-xs text-red-400 font-medium capitalize">Super Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 font-semibold">
                A
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
