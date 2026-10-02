import { useState, useEffect } from "react";
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
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useUnread } from "../context/UnreadContext";
import Alert from "../components/Alert";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "About", path: "/dashboard/about", icon: UserRound },
  { label: "Skills", path: "/dashboard/skills", icon: Code2 },
  { label: "Projects", path: "/dashboard/projects", icon: FolderKanban },
  { label: "Blogs", path: "/dashboard/blogs", icon: FileText },
  { label: "Experience", path: "/dashboard/experience", icon: BriefcaseBusiness },
  { label: "Testimonials", path: "/dashboard/testimonials", icon: MessageSquareQuote },
  { label: "Services", path: "/dashboard/services", icon: Wrench },
  { label: "Messages", path: "/dashboard/messages", icon: Mail },
];

/* ==================== SIDEBAR ==================== */
function SidebarContent({ user, onNavigate, onLogout, mobile = false }) {
  const location = useLocation();
  const { unreadCount } = useUnread();

  return (
    <div className="relative flex h-full flex-col bg-slate-950 text-white overflow-hidden">
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-600/20 blur-[90px]" />
        <div className="absolute bottom-0 -right-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[90px]" />
      </div>

      {/* ==================== BRAND ==================== */}
      <div className="relative safe-area-top border-b border-white/5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
            <ShieldCheck size={20} className="text-white" strokeWidth={2.2} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-[17px]">
              Portfolio CMS
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400 sm:text-xs">
              Administration Panel
            </p>
          </div>
        </div>
      </div>

      {/* ==================== NAV ==================== */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
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
                className={`group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-xl bg-blue-500/30 blur-md -z-10" />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.3 : 2}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span className="flex-1 truncate text-left">{item.label}</span>

                {mobile && isActive && (
                  <ChevronRight size={16} className="shrink-0 text-white/80" />
                )}

                {item.label === "Messages" && !isActive && unreadCount > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ==================== USER PROFILE (NOW CLICKABLE) ==================== */}
      <div className="relative safe-area-bottom border-t border-white/5 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => onNavigate("/dashboard/account")}
          className="group mb-3 w-full rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl px-3.5 py-3 text-left transition hover:border-white/[0.12] hover:bg-white/[0.08] sm:px-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-[12px] font-bold text-white shadow-md">
                {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.full_name || "Administrator"}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                {user?.email || ""}
              </p>
            </div>

            <ChevronRight
              size={14}
              className="shrink-0 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Administrator
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98] sm:px-4"
        >
          <LogOut
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

/* ==================== LOGOUT MODAL ==================== */
function LogoutConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        style={{ animation: "backdropFade 0.25s ease-out forwards" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        style={{ animation: "modalPop 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

        <div className="p-6 sm:p-7">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={26} strokeWidth={2.2} />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            Log out of your account?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You'll need to sign in again to access the Portfolio CMS admin panel.
            Any unsaved changes will be lost.
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="ios-button inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <LogOut size={16} />
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== LOGOUT SPLASH ==================== */
function LogoutSplash({ open }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-950 text-white"
      style={{ animation: "splashFadeIn 0.35s ease-out forwards" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-500/40">
          <ShieldCheck size={28} className="text-white" strokeWidth={2.2} />
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-[3px] border-slate-950" />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Loader2 size={20} className="animate-spin text-blue-400" />
          <p className="text-sm font-medium text-slate-300">Logging out...</p>
        </div>

        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ animation: "progressSweep 1.5s ease-in-out forwards" }}
          />
        </div>

        <p className="mt-6 max-w-xs text-center text-xs leading-5 text-slate-500">
          Please wait while we securely sign you out.
        </p>
      </div>
    </div>
  );
}

/* ==================== MAIN LAYOUT ==================== */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSplash, setShowLogoutSplash] = useState(false);

  const { user, logout } = useAuth();
  const { notification, hideNotification } = useNotification();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (showLogoutConfirm || showLogoutSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogoutConfirm, showLogoutSplash]);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const requestLogout = () => {
    setMobileMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setShowLogoutSplash(true);

    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const currentItem = menuItems.find((item) =>
    item.path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .slide-in-left { animation: slideInLeft 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        @keyframes backdropFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .backdrop-fade { animation: backdropFade 0.3s ease-out forwards; }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes splashFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes progressSweep {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .ios-scroll { -webkit-overflow-scrolling: touch; }
        .ios-button {
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease, background-color 0.2s ease;
        }
        .ios-button:active { transform: scale(0.97); }
      `}</style>

      {notification && (
        <div className="fixed left-4 right-4 top-4 z-[100] sm:left-auto sm:right-6 sm:w-[420px] fade-in">
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
          <div className="fixed inset-y-0 left-0 w-72 z-40">
            <SidebarContent
              user={user}
              onNavigate={handleNavigate}
              onLogout={requestLogout}
            />
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden" aria-hidden="true">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md backdrop-fade"
            />

            <aside className="safe-area-right safe-area-left absolute inset-y-0 left-0 w-[86%] max-w-sm shadow-2xl shadow-black/50 slide-in-left">
              <SidebarContent
                user={user}
                onNavigate={handleNavigate}
                onLogout={requestLogout}
                mobile
              />
            </aside>

            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="ios-button fixed right-4 top-4 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl shadow-xl active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header
            className={`safe-area-top sticky top-0 z-30 transition-all duration-300 ${
              scrolled
                ? "border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm"
                : "border-b border-transparent bg-white/60 backdrop-blur-md"
            }`}
          >
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  onClick={() => setMobileMenuOpen(true)}
                  className="ios-button flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block">
                    Portfolio CMS
                  </p>
                  <h2 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                    {currentItem?.label || "Admin Dashboard"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop user chip — now clickable */}
                <button
                  type="button"
                  onClick={() => handleNavigate("/dashboard/account")}
                  className="hidden md:flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition hover:bg-slate-50"
                >
                  <div className="relative">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-[11px] font-bold text-white">
                      {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>
                  <div className="min-w-0 max-w-[140px]">
                    <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                      {user?.full_name || "Admin"}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 truncate leading-tight">
                      {user?.email || ""}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={requestLogout}
                  className="ios-button flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 sm:px-4"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8 ios-scroll">
            <Outlet />
          </div>
        </main>
      </div>

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />

      <LogoutSplash open={showLogoutSplash} />
    </div>
  );
}