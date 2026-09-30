import { useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { resolveImageUrl } from "../utils/imageUrl";

function estimateReadTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ");
}

export default function BlogModal({ blog, onClose }) {
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

  if (!blog) return null;

  const cover = resolveImageUrl(blog.featured_image);
  const plain = stripHtml(blog.content || blog.excerpt || "");
  const readTime = estimateReadTime(plain);

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
        className="
          relative z-10 flex w-full max-h-[92vh] flex-col overflow-hidden
          rounded-t-[28px] sm:max-w-3xl sm:rounded-3xl
          border border-slate-200 bg-white
          dark:border-slate-800 dark:bg-slate-950
          shadow-2xl
          animate-[slideUp_320ms_cubic-bezier(0.22,1,0.36,1)]
        "
      >
        {/* iOS grab handle (mobile only) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header bar */}
        <div className="
          flex items-center justify-between gap-3 border-b px-5 py-4
          border-slate-200 dark:border-slate-800
        ">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>Article</span>
            <span className="h-1 w-1 rounded-full bg-blue-500/50" />
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 normal-case font-medium tracking-normal">
              <Clock size={13} />
              {readTime}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              grid h-9 w-9 place-items-center rounded-full
              text-slate-500 hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white
              transition
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto overscroll-contain px-6 py-8 sm:px-10 sm:py-10">
          {/* Date */}
          {blog.published_at && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calendar size={13} />
              {new Date(blog.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {/* Title */}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
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
            <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <img
                src={cover}
                alt={blog.title}
                className="h-auto w-full object-cover"
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
        <div className="h-2 sm:hidden" />
      </div>

      {/* Inline keyframes (no config changes needed) */}
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