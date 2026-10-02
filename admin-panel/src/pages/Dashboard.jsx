import { useEffect, useState } from "react";
import {
  UserRound,
  Code2,
  FolderKanban,
  FileText,
  BriefcaseBusiness,
  MessageSquareQuote,
  Wrench,
  Mail,
  Images,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const cards = [
  {
    key: "about",
    label: "About",
    icon: UserRound,
    gradient: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
    accent: "bg-blue-500",
  },
  {
    key: "skills",
    label: "Skills",
    icon: Code2,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    accent: "bg-violet-500",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    accent: "bg-emerald-500",
  },
  {
    key: "blogs",
    label: "Blogs",
    icon: FileText,
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/20",
    accent: "bg-orange-500",
  },
  {
    key: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
    accent: "bg-pink-500",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/20",
    accent: "bg-cyan-500",
  },
  {
    key: "services",
    label: "Services",
    icon: Wrench,
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    accent: "bg-indigo-500",
  },
  {
    key: "messages",
    label: "Messages",
    icon: Mail,
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "shadow-fuchsia-500/20",
    accent: "bg-fuchsia-500",
  },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to load dashboard data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative space-y-6 sm:space-y-8">
      {/* ==================== STYLES ==================== */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeSlideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.15) 0%,
            rgba(148, 163, 184, 0.3) 50%,
            rgba(148, 163, 184, 0.15) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }

        @keyframes numberPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .number-pop {
          animation: numberPop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.4); }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
      `}</style>

      {/* ==================== HEADER ==================== */}
      <div
        className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${
          visible ? "fade-up" : "opacity-0"
        }`}
      >
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot" />
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Overview
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Welcome to your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              CMS
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your portfolio content, projects, blogs, services,
            messages and media from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSummary}
          disabled={loading}
          className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 shrink-0"
        >
          <RefreshCw
            size={16}
            className={`transition-transform duration-300 ${
              loading ? "animate-spin" : "group-hover:rotate-180"
            }`}
          />
          Refresh
        </button>
      </div>

      {/* ==================== ERROR ==================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 flex items-center gap-3 fade-up">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
          {error}
        </div>
      )}

      {/* ==================== STAT CARDS ==================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 ${
                visible ? "fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              {/* Soft gradient glow on hover */}
              <div
                className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]`}
              />

              <div className="relative flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-md ${card.glow} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={20} className="text-white" strokeWidth={2} />
                </div>

                {loading ? (
                  <div className="h-8 w-12 rounded-lg shimmer" />
                ) : (
                  <span className="text-3xl font-bold text-slate-900 number-pop">
                    {summary?.[card.key] ?? 0}
                  </span>
                )}
              </div>

              <p className="relative mt-5 text-sm font-semibold text-slate-700">
                {card.label}
              </p>

              {/* Bottom accent line on hover */}
              <div
                className={`absolute bottom-0 left-0 h-[3px] w-0 ${card.accent} transition-all duration-500 group-hover:w-full`}
              />
            </div>
          );
        })}
      </div>

      {/* ==================== MESSAGE STATUS ==================== */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
          visible ? "fade-up" : "opacity-0"
        }`}
        style={{ animationDelay: `${cards.length * 55}ms` }}
      >
        {/* Amber gradient accent (subtle) */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-[0.08] blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Message status
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep track of messages that still need your attention.
            </p>
          </div>

          <div className="relative shrink-0 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 px-5 py-4 shadow-sm min-w-[160px]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" />
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Unread
              </p>
            </div>

            {loading ? (
              <div className="mt-2 h-7 w-12 rounded-lg shimmer" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-amber-700 number-pop">
                {summary?.unread_messages ?? 0}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}