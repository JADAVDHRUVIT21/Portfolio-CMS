import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

/* -------------------------
   Single testimonial card
   (extracted so marquee + grid share it)
------------------------- */
function TestimonialCard({ testimonial, fixedWidth = false }) {
  return (
    <article
      className={`
        group relative flex h-full flex-col rounded-2xl border p-7 shadow-sm
        border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950
        transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-2 hover:scale-[1.015]
        hover:border-blue-300
        hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)]
        dark:hover:border-blue-500/50
        dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]
        ${fixedWidth ? "w-[340px] shrink-0 sm:w-[380px]" : ""}
      `}
    >
      {/* Big decorative quote mark */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute right-5 top-3 select-none
          text-[68px] font-serif leading-none
          text-blue-500/[0.08] dark:text-blue-400/[0.12]
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      >
        ”
      </span>

      {/* Soft gradient overlay on hover */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          bg-gradient-to-br from-blue-500/0 to-indigo-500/0
          opacity-0 transition-opacity duration-400
          group-hover:from-blue-500/[0.05] group-hover:to-indigo-500/[0.07]
          group-hover:opacity-100
        "
      />

      <div
        className="
          relative flex h-11 w-11 items-center justify-center rounded-xl
          bg-blue-100 text-blue-600
          dark:bg-blue-500/15 dark:text-blue-400
          transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-110 group-hover:rotate-3
          group-hover:bg-blue-500 group-hover:text-white
          dark:group-hover:bg-blue-500 dark:group-hover:text-white
          group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
        "
      >
        <Quote size={21} />
      </div>

      <p className="relative mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
        “{testimonial.message}”
      </p>

      {/* Author row — pinned to bottom */}
      <div className="relative mt-auto pt-7 flex items-center gap-4">
        {testimonial.profile_image ? (
          <img
            src={testimonial.profile_image}
            alt={testimonial.name}
            className="
              h-11 w-11 rounded-full object-cover
              ring-2 ring-transparent
              transition-all duration-400
              group-hover:ring-blue-400/60
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex h-11 w-11 items-center justify-center rounded-full font-bold
              bg-blue-100 text-blue-600
              dark:bg-blue-500/15 dark:text-blue-400
              transition-all duration-400
              group-hover:scale-105 group-hover:bg-blue-500 group-hover:text-white
              dark:group-hover:bg-blue-500 dark:group-hover:text-white
            "
          >
            {testimonial.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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
          className="
            relative mt-5 flex gap-0.5 text-sm font-medium text-amber-500 dark:text-amber-400
            transition-all duration-400
            group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]
          "
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

/* -------------------------
   Marquee row — infinite horizontal scroll
   - Hover pauses (via CSS group-hover + animation-play-state)
   - Duplicates items so loop is seamless
------------------------- */
function MarqueeRow({ items, reverse = false, duration = 45 }) {
  // Duplicate the items so the loop has no gap
  const doubled = [...items, ...items];

  return (
    <div
      className="group/marquee relative overflow-hidden"
      style={{
        // Fade edges into background
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
          animationPlayState: "running",
        }}
        // Pause on hover using inline state via CSS class trick:
        // We use a data attribute + CSS instead of state to avoid re-renders.
        data-marquee
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {doubled.map((testimonial, idx) => (
          <TestimonialCard
            key={`${testimonial.id}-${idx}`}
            testimonial={testimonial}
            fixedWidth
          />
        ))}
      </div>
    </div>
  );
}

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
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        )}

        {/* ---------- SINGLE-ROW MARQUEE (4–6) ---------- */}
        {!loading && !error && useMarquee && !useTwoRows && (
          <Reveal delay={120} y={32}>
            <div className="mt-14">
              <MarqueeRow items={row1} duration={duration1} />
            </div>
          </Reveal>
        )}

        {/* ---------- TWO-ROW MARQUEE (> 6) ---------- */}
        {!loading && !error && useTwoRows && (
          <Reveal delay={120} y={32}>
            <div className="mt-14 space-y-6">
              <MarqueeRow items={row1} duration={duration1} />
              <MarqueeRow items={row2} duration={duration2} reverse />
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