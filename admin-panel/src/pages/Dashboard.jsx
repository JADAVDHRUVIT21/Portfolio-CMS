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
  },
  {
    key: "skills",
    label: "Skills",
    icon: Code2,
  },
  {
    key: "projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    key: "blogs",
    label: "Blogs",
    icon: FileText,
  },
  {
    key: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
  },
  {
    key: "services",
    label: "Services",
    icon: Wrench,
  },
  {
    key: "messages",
    label: "Messages",
    icon: Mail,
  },
  {
    key: "media",
    label: "Media",
    icon: Images,
  },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dashboard/summary"
      );

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
  }, []);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome to your CMS
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your portfolio content, projects,
            blogs, services, messages and media from
            one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSummary}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Dashboard Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} />
                </div>

                <span className="text-3xl font-bold text-slate-900">
                  {loading
                    ? "—"
                    : summary?.[card.key] ?? 0}
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-700">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Message Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Message status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of messages that still need
              your attention.
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 px-4 py-3">
            <p className="text-xs font-medium text-amber-600">
              Unread messages
            </p>

            <p className="mt-1 text-2xl font-bold text-amber-700">
              {loading
                ? "—"
                : summary?.unread_messages ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}