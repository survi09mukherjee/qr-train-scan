import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, QrCode, Users, User, LogOut } from "lucide-react";
import Notifications from "./Notifications";

const SidebarItem = ({ icon: Icon, label, to }: { icon: any; label: string; to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary">QR Train Scan</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={QrCode} label="Scan QR" to="/scan" />
          <SidebarItem icon={Users} label="Sessions" to="/sessions" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 border-b flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold text-primary">QR Train Scan</h1>
          <Notifications />
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-end mb-6 md:flex hidden">
            <Notifications />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
