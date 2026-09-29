import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Code2,
  FolderKanban,
  FileText,
  BriefcaseBusiness,
  MessageSquareQuote,
  Wrench,
  Mail,
  Images,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Alert from "../components/Alert";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "About",
    path: "/dashboard/about",
    icon: UserRound,
  },
  {
    label: "Skills",
    path: "/dashboard/skills",
    icon: Code2,
  },
  {
    label: "Projects",
    path: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Blogs",
    path: "/dashboard/blogs",
    icon: FileText,
  },
  {
    label: "Experience",
    path: "/dashboard/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Testimonials",
    path: "/dashboard/testimonials",
    icon: MessageSquareQuote,
  },
  {
    label: "Services",
    path: "/dashboard/services",
    icon: Wrench,
  },
  {
    label: "Messages",
    path: "/dashboard/messages",
    icon: Mail,
  },
  {
    label: "Media",
    path: "/dashboard/media",
    icon: Images,
  },
];

function SidebarContent({
  user,
  onNavigate,
  onLogout,
  mobile = false,
}) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="safe-area-top border-b border-white/10 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-sm font-bold shadow-lg shadow-blue-500/20">
            PC
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold sm:text-xl">
              Portfolio CMS
            </h1>

            <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
              Administration Panel
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Management
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`ios-button flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.3 : 2}
                  className="shrink-0"
                />

                <span className="flex-1 truncate text-left">
                  {item.label}
                </span>

                {mobile && isActive && (
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-white/70"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="safe-area-bottom border-t border-white/10 p-3 sm:p-4">
        <div className="mb-3 rounded-2xl bg-white/5 px-3.5 py-3 sm:px-4">
          <p className="truncate text-sm font-semibold text-white">
            {user?.full_name || "Administrator"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400">
            {user?.email || ""}
          </p>

          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
            Administrator
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="ios-button flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 sm:px-4"
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const {
    notification,
    hideNotification,
  } = useNotification();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7]">
      {/* Global Notification */}
      {notification && (
        <div className="fixed left-4 right-4 top-4 z-[100] sm:left-auto sm:right-6 sm:w-[420px]">
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
          <div className="fixed inset-y-0 left-0 w-72">
            <SidebarContent
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            aria-hidden="true"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            <aside className="safe-area-right safe-area-left absolute inset-y-0 left-0 w-[86%] max-w-sm shadow-2xl">
              <SidebarContent
                user={user}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                mobile
              />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <header className="safe-area-top sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex min-h-16 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  onClick={() => setMobileMenuOpen(true)}
                  className="ios-button flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                >
                  <Menu size={21} />
                </button>

                <div className="min-w-0">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                    Portfolio CMS
                  </p>

                  <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                    Admin Dashboard
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ios-button flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 sm:px-4"
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Close Button */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="ios-button fixed right-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-xl lg:hidden"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}