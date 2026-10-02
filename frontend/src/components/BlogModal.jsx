import { useEffect, useRef, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { resolveImageUrl } from "../utils/imageUrl";

/* =========================================================
   COLOR STYLES (Same Palette as About/Projects/Skills/Experience)
========================================================= */
const cardStyles = [
  {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    accent: "bg-blue-500",
    border: "hover:border-blue-300 dark:hover:border-blue-500/50",
    tint: "hover:bg-blue-50/40 dark:hover:bg-blue-500/[0.08]",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
    iconText: "text-blue-600 dark:text-blue-400",
    iconHover: "group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500",
    quoteColor: "text-blue-500/[0.08] dark:text-blue-400/[0.12]",
    ring: "group-hover:ring-blue-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]",
    coverBorder: "group-hover:border-blue-300 dark:group-hover:border-blue-500/50",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    border: "hover:border-violet-300 dark:hover:border-violet-500/50",
    tint: "hover:bg-violet-50/40 dark:hover:bg-violet-500/[0.08]",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/15",
    iconText: "text-violet-600 dark:text-violet-400",
    iconHover: "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500",
    quoteColor: "text-violet-500/[0.08] dark:text-violet-400/[0.12]",
    ring: "group-hover:ring-violet-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(139,92,246,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(139,92,246,0.45)]",
    coverBorder: "group-hover:border-violet-300 dark:group-hover:border-violet-500/50",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
    tint: "hover:bg-emerald-50/40 dark:hover:bg-emerald-500/[0.08]",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconText: "text-emerald-600 dark:text-emerald-400",
    iconHover: "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500",
    quoteColor: "text-emerald-500/[0.08] dark:text-emerald-400/[0.12]",
    ring: "group-hover:ring-emerald-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.45)]",
    coverBorder: "group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50",
  },
  {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    accent: "bg-orange-500",
    border: "hover:border-orange-300 dark:hover:border-orange-500/50",
    tint: "hover:bg-orange-50/40 dark:hover:bg-orange-500/[0.08]",
    text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-500/15",
    iconText: "text-orange-600 dark:text-orange-400",
    iconHover: "group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500",
    quoteColor: "text-orange-500/[0.08] dark:text-orange-400/[0.12]",
    ring: "group-hover:ring-orange-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(249,115,22,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(249,115,22,0.45)]",
    coverBorder: "group-hover:border-orange-300 dark:group-hover:border-orange-500/50",
  },
  {
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    accent: "bg-pink-500",
    border: "hover:border-pink-300 dark:hover:border-pink-500/50",
    tint: "hover:bg-pink-50/40 dark:hover:bg-pink-500/[0.08]",
    text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-500/15",
    iconText: "text-pink-600 dark:text-pink-400",
    iconHover: "group-hover:bg-pink-500 group-hover:text-white dark:group-hover:bg-pink-500",
    quoteColor: "text-pink-500/[0.08] dark:text-pink-400/[0.12]",
    ring: "group-hover:ring-pink-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(236,72,153,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(236,72,153,0.45)]",
    coverBorder: "group-hover:border-pink-300 dark:group-hover:border-pink-500/50",
  },
  {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/30",
    accent: "bg-indigo-500",
    border: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
    tint: "hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.08]",
    text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/15",
    iconText: "text-indigo-600 dark:text-indigo-400",
    iconHover: "group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500",
    quoteColor: "text-indigo-500/[0.08] dark:text-indigo-400/[0.12]",
    ring: "group-hover:ring-indigo-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(99,102,241,0.45)]",
    coverBorder: "group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50",
  },
  {
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/50",
    tint: "hover:bg-cyan-50/40 dark:hover:bg-cyan-500/[0.08]",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-500/15",
    iconText: "text-cyan-600 dark:text-cyan-400",
    iconHover: "group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:bg-cyan-500",
    quoteColor: "text-cyan-500/[0.08] dark:text-cyan-400/[0.12]",
    ring: "group-hover:ring-cyan-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(6,182,212,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(6,182,212,0.45)]",
    coverBorder: "group-hover:border-cyan-300 dark:group-hover:border-cyan-500/50",
  },
  {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    border: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
    tint: "hover:bg-fuchsia-50/40 dark:hover:bg-fuchsia-500/[0.08]",
    text: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-500/15",
    iconText: "text-fuchsia-600 dark:text-fuchsia-400",
    iconHover: "group-hover:bg-fuchsia-500 group-hover:text-white dark:group-hover:bg-fuchsia-500",
    quoteColor: "text-fuchsia-500/[0.08] dark:text-fuchsia-400/[0.12]",
    ring: "group-hover:ring-fuchsia-400/60",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(217,70,239,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(217,70,239,0.45)]",
    coverBorder: "group-hover:border-fuchsia-300 dark:group-hover:border-fuchsia-500/50",
  },
];

function estimateReadTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ");
}

export default function BlogModal({ blog, onClose }) {
  const modalRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /* Lock body scroll while open */
  useEffect(() => {
    if (!blog) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [blog]);

  /* Esc to close */
  useEffect(() => {
    if (!blog) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [blog, onClose]);

  /* 3D Tilt Effect */
  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    const maxTilt = 2;
    setTilt({ x: -yPct * maxTilt, y: xPct * maxTilt });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!blog) return null;

  const cover = resolveImageUrl(blog.featured_image);
  const plain = stripHtml(blog.content || blog.excerpt || "");
  const readTime = estimateReadTime(plain);

  // Pick color based on blog id or a fallback
  const styleIndex = blog.id ? Number(blog.id) % cardStyles.length : 0;
  const style = cardStyles[styleIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={blog.title}
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="
          absolute inset-0 bg-slate-900/50 backdrop-blur-md
          dark:bg-black/70
          animate-[fadeIn_200ms_ease-out]
        "
      />

      {/* Sheet */}
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
        className={`
          group relative z-10 flex w-full max-h-[92vh] flex-col overflow-hidden
          rounded-t-[28px] sm:max-w-3xl sm:rounded-3xl
          border bg-white
          dark:bg-slate-950
          border-slate-200 dark:border-slate-800
          ${style.border}
          ${style.tint}
          ${style.shadow}
          animate-[slideUp_320ms_cubic-bezier(0.22,1,0.36,1)]
        `}
      >
        {/* =================================================
            SHINE SWEEP EFFECT
        ================================================= */}
        <div
          className="
            pointer-events-none absolute inset-0 z-30 rounded-t-[28px] sm:rounded-3xl
            bg-gradient-to-tr from-transparent via-white/10 to-transparent
            opacity-0 group-hover:opacity-100
            -translate-x-full group-hover:translate-x-full
            transition-all duration-1000 ease-out
            dark:via-white/[0.03]
          "
        />

        {/* iOS grab handle (mobile only) */}
        <div className="flex justify-center pt-3 sm:hidden relative z-20">
          <span className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header bar */}
        <div className="
          relative z-20 flex items-center justify-between gap-3 border-b px-5 py-4
          border-slate-200 dark:border-slate-800
        ">
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${style.text.replace('group-hover:', 'text-')}`}>
            <span>Article</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-50" />
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 normal-case font-medium tracking-normal">
              <Clock size={13} />
              {readTime}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`
              grid h-9 w-9 place-items-center rounded-full
              text-slate-500 hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white
              transition
              ${style.text.replace('group-hover:', 'hover:')}
            `}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="relative z-20 overflow-y-auto overscroll-contain px-6 py-8 sm:px-10 sm:py-10">
          {/* Date */}
          {blog.published_at && (
            <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 text-slate-500 dark:text-slate-400 ${style.text}`}>
              <Calendar size={13} />
              {new Date(blog.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {/* Title */}
          <h1 className={`mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl transition-colors duration-300 ${style.text}`}>
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              {blog.excerpt}
            </p>
          )}

          {/* Cover */}
          {cover && (
            <figure className={`mt-8 overflow-hidden rounded-2xl border transition-colors duration-300 border-slate-200 dark:border-slate-800 ${style.coverBorder}`}>
              <img
                src={cover}
                alt={blog.title}
                className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />
            </figure>
          )}

          {/* Content */}
          <div className="mt-8">
            {blog.content ? (
              <div className="whitespace-pre-line text-base leading-8 text-slate-700 dark:text-slate-300">
                {blog.content}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No additional content available.
              </p>
            )}
          </div>
        </div>

        {/* Bottom safe area for mobile */}
        <div className="h-2 sm:hidden relative z-20" />
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}