import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    avatarHover: "group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]",
    avatarHover: "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(139,92,246,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(139,92,246,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    avatarHover: "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(16,185,129,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]",
    avatarHover: "group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(249,115,22,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(249,115,22,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
    avatarHover: "group-hover:bg-pink-500 group-hover:text-white dark:group-hover:bg-pink-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(236,72,153,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(236,72,153,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
    avatarHover: "group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(99,102,241,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]",
    avatarHover: "group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:bg-cyan-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(6,182,212,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(6,182,212,0.45)]",
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
    starGlow: "group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]",
    avatarHover: "group-hover:bg-fuchsia-500 group-hover:text-white dark:group-hover:bg-fuchsia-500",
    shadow: "hover:shadow-[0_25px_50px_-20px_rgba(217,70,239,0.35)] dark:hover:shadow-[0_25px_50px_-20px_rgba(217,70,239,0.45)]",
  },
];

/* =========================================================
   SINGLE TESTIMONIAL CARD (Full Animations Everywhere)
========================================================= */
function TestimonialCard({ testimonial, index = 0, fixedWidth = false }) {
  const style = cardStyles[index % cardStyles.length];
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Tilt Effect on Mouse Move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    
    const maxTilt = 6; 
    setTilt({
      x: -yPct * maxTilt,
      y: xPct * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
      }}
      className={`
        group relative flex h-full flex-col rounded-2xl border p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950
        ${style.border}
        ${style.tint}
        ${style.shadow}
        ${fixedWidth ? "w-[340px] shrink-0 sm:w-[380px]" : ""}
      `}
    >
      {/* =================================================
          SHINE SWEEP EFFECT
      ================================================= */}
      <div
        className="
          pointer-events-none absolute inset-0 z-20 rounded-2xl
          bg-gradient-to-tr from-transparent via-white/10 to-transparent
          opacity-0 group-hover:opacity-100
          -translate-x-full group-hover:translate-x-full
          transition-all duration-1000 ease-out
          dark:via-white/[0.03]
        "
      />

      {/* Big decorative quote mark - COLORED */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute right-5 top-3 z-10 select-none
          text-[68px] font-serif leading-none
          ${style.quoteColor}
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        `}
      >
        ”
      </span>

      {/* Soft gradient overlay on hover - COLORED */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0 rounded-2xl
          bg-gradient-to-br opacity-0 transition-opacity duration-400
          group-hover:opacity-100
          ${style.gradient.replace('from-', 'group-hover:from-').replace('to-', 'group-hover:to-')}
        `}
        style={{
          backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
        }}
      />

      {/* Quote Icon - COLORED */}
      <div
        className={`
          relative z-20 flex h-11 w-11 items-center justify-center rounded-xl
          ${style.iconBg} ${style.iconText}
          transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-110 group-hover:rotate-3
          ${style.iconHover}
          group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
        `}
      >
        <Quote size={21} />
      </div>

      <p className="relative z-20 mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
        “{testimonial.message}”
      </p>

      {/* Author row — pinned to bottom */}
      <div className="relative z-20 mt-auto pt-7 flex items-center gap-4">
        {testimonial.profile_image ? (
          <img
            src={testimonial.profile_image}
            alt={testimonial.name}
            className={`
              h-11 w-11 rounded-full object-cover
              ring-2 ring-transparent
              transition-all duration-400
              ${style.ring}
              group-hover:scale-105
            `}
          />
        ) : (
          <div
            className={`
              flex h-11 w-11 items-center justify-center rounded-full font-bold
              ${style.iconBg} ${style.iconText}
              transition-all duration-400
              group-hover:scale-105 
              ${style.avatarHover}
            `}
          >
            {testimonial.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div>
          <h3 className={`font-semibold text-slate-900 transition-colors duration-300 dark:text-white ${style.text}`}>
            {testimonial.name}
          </h3>

          {(testimonial.role || testimonial.company) && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {[testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
        </div>
      </div>

      {testimonial.rating && (
        <div
          className={`
            relative z-20 mt-5 flex gap-0.5 text-sm font-medium text-amber-500 dark:text-amber-400
            transition-all duration-400
            ${style.starGlow}
          `}
        >
          {Array.from({
            length: Math.min(5, testimonial.rating),
          }).map((_, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                transition: `transform 300ms cubic-bezier(0.22,1,0.36,1) ${
                  idx * 40
                }ms`,
              }}
              className="group-hover:-translate-y-0.5"
            >
              ★
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/* =========================================================
   MARQUEE ROW (with pause-on-hover for tilt to work)
========================================================= */
function MarqueeRow({ items, reverse = false, duration = 45, startIndex = 0 }) {
  const doubled = [...items, ...items];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 80px, black calc(100% - 80px), transparent 100%)",
      }}
    >
      <div
        className="flex gap-6 py-2"
        style={{
          width: "max-content",
          animation: `${reverse ? "marqueeReverse" : "marquee"} ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {doubled.map((testimonial, idx) => (
          <div
            key={`${testimonial.id}-${idx}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <TestimonialCard
              testimonial={testimonial}
              index={startIndex + idx}
              fixedWidth
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN TESTIMONIALS COMPONENT
========================================================= */
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response.data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setError("Unable to load testimonials right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const count = testimonials.length;

  // Decide layout
  const useMarquee = count > 3;
  const useTwoRows = count > 6;

  // Split for two-row marquee — balanced halves
  const half = Math.ceil(count / 2);
  const row1 = useTwoRows ? testimonials.slice(0, half) : testimonials;
  const row2 = useTwoRows ? testimonials.slice(half) : [];

  // Duration scales with content length so speed feels consistent
  const duration1 = Math.max(35, row1.length * 9);
  const duration2 = Math.max(35, row2.length * 9);

  return (
    <section
      id="testimonials"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-slate-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
        transition-colors duration-300
        overflow-hidden
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading — staggered reveal */}
        <div className="text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Testimonials
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What people say.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Feedback and experiences shared by people I have worked with.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading testimonials...
            </div>
          </Reveal>
        )}

        {/* Error */}
        {!loading && error && (
          <Reveal delay={0} y={20}>
            <div
              className="
                mx-auto mt-12 max-w-xl rounded-2xl border p-6 text-center
                border-red-200 bg-red-50
                dark:border-red-500/30 dark:bg-red-500/10
              "
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && count === 0 && (
          <Reveal delay={0} y={20}>
            <div
              className="
                mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
                border-slate-200 bg-white
                dark:border-slate-800 dark:bg-slate-950
              "
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                No testimonials added yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Testimonials added through the CMS will appear here
                automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* ---------- STATIC GRID (≤ 3) ---------- */}
        {!loading && !error && count > 0 && !useMarquee && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Reveal
                key={testimonial.id}
                delay={i * 120}
                y={32}
                className="h-full"
              >
                <TestimonialCard testimonial={testimonial} index={i} />
              </Reveal>
            ))}
          </div>
        )}

        {/* ---------- SINGLE-ROW MARQUEE (4–6) ---------- */}
        {!loading && !error && useMarquee && !useTwoRows && (
          <Reveal delay={120} y={32}>
            <div className="mt-14">
              <MarqueeRow items={row1} duration={duration1} startIndex={0} />
            </div>
          </Reveal>
        )}

        {/* ---------- TWO-ROW MARQUEE (> 6) ---------- */}
        {!loading && !error && useTwoRows && (
          <Reveal delay={120} y={32}>
            <div className="mt-14 space-y-6">
              <MarqueeRow items={row1} duration={duration1} startIndex={0} />
              <MarqueeRow items={row2} duration={duration2} reverse startIndex={row1.length} />
            </div>
          </Reveal>
        )}
      </div>

      {/* Keyframes for marquee */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-marquee] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}