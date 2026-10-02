import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Database,
  Globe,
  Layers,
  Sparkles,
  Server,
  Monitor,
  Smartphone,
  Layout,
  Braces,
  Cloud,
  Settings,
} from "lucide-react";

import api from "../services/api";

/* =========================================================
   ICON MAP
========================================================= */

const iconMap = {
  Code2,
  Database,
  Globe,
  Layers,
  Sparkles,
  Server,
  Monitor,
  Smartphone,
  Layout,
  Braces,
  Cloud,
  Settings,
};

/* =========================================================
   CARD STYLES
========================================================= */

const cardStyles = [
  {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    accent: "bg-blue-500",
    border: "hover:border-blue-300 dark:hover:border-blue-500/50",
    tint: "hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.08]",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    border: "hover:border-violet-300 dark:hover:border-violet-500/50",
    tint: "hover:bg-violet-50/60 dark:hover:bg-violet-500/[0.08]",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
    tint: "hover:bg-emerald-50/60 dark:hover:bg-emerald-500/[0.08]",
  },
  {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    accent: "bg-orange-500",
    border: "hover:border-orange-300 dark:hover:border-orange-500/50",
    tint: "hover:bg-orange-50/60 dark:hover:bg-orange-500/[0.08]",
  },
  {
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    accent: "bg-pink-500",
    border: "hover:border-pink-300 dark:hover:border-pink-500/50",
    tint: "hover:bg-pink-50/60 dark:hover:bg-pink-500/[0.08]",
  },
  {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/30",
    accent: "bg-indigo-500",
    border: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
    tint: "hover:bg-indigo-50/60 dark:hover:bg-indigo-500/[0.08]",
  },
  {
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/50",
    tint: "hover:bg-cyan-50/60 dark:hover:bg-cyan-500/[0.08]",
  },
  {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    border: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
    tint: "hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-500/[0.08]",
  },
];

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function Reveal({ children, delay = 0, y = 30, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        opacity: visible ? 1 : 0,
        transition:
          "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/* =========================================================
   IMAGE URL CHECK
========================================================= */

function isImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith("data:image/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
}

/* =========================================================
   GET LUCIDE ICON
========================================================= */

function getIcon(iconName) {
  if (!iconName || typeof iconName !== "string") return Code2;
  return iconMap[iconName.trim()] || Code2;
}

/* =========================================================
   CARD VISUAL
========================================================= */

function CardVisual({ icon, title, gradient, glow }) {
  const [imageError, setImageError] = useState(false);
  const iconValue = typeof icon === "string" ? icon.trim() : "";
  const shouldRenderImage = isImageUrl(iconValue) && !imageError;

  if (shouldRenderImage) {
    return (
      <div
        className={`
          relative flex h-12 w-12 shrink-0 items-center justify-center
          overflow-hidden rounded-xl border border-slate-100 bg-white
          shadow-md ${glow} transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110
          group-hover:-rotate-3 dark:border-slate-800 dark:bg-slate-900
        `}
      >
        <img
          src={iconValue}
          alt={`${title} icon`}
          className="block h-full w-full object-contain p-2"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  const Icon = getIcon(iconValue);

  return (
    <div
      className={`
        relative flex h-12 w-12 shrink-0 items-center justify-center
        rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md
        ${glow} transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110
        group-hover:-rotate-3
      `}
    >
      <Icon size={22} strokeWidth={2} />
    </div>
  );
}

/* =========================================================
   SINGLE ABOUT CARD (WITH ENHANCED ANIMATIONS)
========================================================= */

function AboutCard({ item, index }) {
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
    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1
    
    // Max tilt angle in degrees
    const maxTilt = 8; 
    setTilt({
      x: -yPct * maxTilt,
      y: xPct * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Reveal delay={240 + index * 110} y={30} className="h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
        className={`
          group relative flex h-full min-h-[188px] flex-col overflow-hidden
          rounded-2xl border p-5 border-slate-200 bg-white
          dark:border-slate-800 dark:bg-slate-950
          ${style.border} ${style.tint}
          hover:shadow-[0_20px_45px_-20px_rgba(37,99,235,0.35)]
        `}
      >
        {/* =================================================
            GRADIENT GLOW
        ================================================= */}
        <div
          className={`
            pointer-events-none absolute -right-16 -top-16 h-40 w-40
            rounded-full bg-gradient-to-br ${style.gradient} opacity-0
            blur-3xl transition-opacity duration-500 group-hover:opacity-20
          `}
        />

        {/* =================================================
            SHINE SWEEP EFFECT
        ================================================= */}
        <div
          className={`
            pointer-events-none absolute inset-0 z-10
            bg-gradient-to-tr from-transparent via-white/10 to-transparent
            opacity-0 group-hover:opacity-100
            -translate-x-full group-hover:translate-x-full
            transition-all duration-1000 ease-out
            dark:via-white/[0.03]
          `}
        />

        {/* =================================================
            ICON / IMAGE
        ================================================= */}
        <div className="relative z-20">
          <CardVisual
            icon={item.icon}
            title={item.title}
            gradient={style.gradient}
            glow={style.glow}
          />
        </div>

        {/* =================================================
            TITLE
        ================================================= */}
        <h3 className="relative z-20 mt-4 text-base font-semibold text-slate-900 dark:text-white">
          {item.title}
        </h3>

        {/* =================================================
            DESCRIPTION
        ================================================= */}
        <p className="relative z-20 mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {item.description}
        </p>

        {/* =================================================
            BOTTOM ACCENT
        ================================================= */}
        <div
          className={`
            absolute bottom-0 left-0 h-[3px] w-0 ${style.accent}
            transition-all duration-500 group-hover:w-full z-20
          `}
        />
      </div>
    </Reveal>
  );
}

/* =========================================================
   ABOUT COMPONENT
========================================================= */

export default function About() {
  const [about, setAbout] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAbout = async () => {
      try {
        setLoading(true);
        const [aboutResponse, cardsResponse] = await Promise.all([
          api.get("/about"),
          api.get("/about/cards"),
        ]);

        if (!mounted) return;

        setAbout(aboutResponse.data || null);

        const receivedCards = Array.isArray(cardsResponse.data)
          ? cardsResponse.data
          : [];

        const sortedCards = [...receivedCards].sort((a, b) => {
          const orderA = Number(a.display_order || 0);
          const orderB = Number(b.display_order || 0);
          if (orderA !== orderB) return orderA - orderB;
          return Number(a.id || 0) - Number(b.id || 0);
        });

        setCards(sortedCards);
      } catch (error) {
        console.error("Failed to load About section:", error);
        if (mounted) {
          setAbout(null);
          setCards([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAbout();
    return () => { mounted = false; };
  }, []);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <section
        id="about"
        className="
          relative overflow-hidden scroll-mt-24 bg-slate-50 px-6 py-24
          text-slate-900 transition-colors duration-300 dark:bg-slate-900
          dark:text-slate-100 sm:px-8 lg:py-32
        "
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-500/10" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-400/10 blur-[120px] dark:bg-violet-500/10" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            {/* LEFT */}
            <div>
              <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 space-y-3">
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 w-4/5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mt-8 h-32 w-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* RIGHT */}
            <div>
              <div className="space-y-3">
                <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mt-10 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div key={item} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
                  ))}
                </div>
                {[3, 4, 5].map((item) => (
                  <div key={item} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!about) return null;

  /* =======================================================
     MAIN ABOUT
  ======================================================= */

  return (
    <section
      id="about"
      className="
        relative overflow-hidden scroll-mt-24 bg-slate-50 px-6 py-24
        text-slate-900 transition-colors duration-300 dark:bg-slate-900
        dark:text-slate-100 sm:px-8 lg:py-32
      "
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-400/10 blur-[120px] dark:bg-violet-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        
        {/* =================================================
            TOP SECTION: TITLE & DESCRIPTION
        ================================================= */}
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start mb-14">
          
          {/* LEFT: TITLE & IMAGE */}
          <Reveal delay={0} y={28}>
            <div className="pt-0 lg:pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3.5 py-1.5 dark:border-blue-500/30 dark:bg-blue-500/10">
                <Sparkles size={13} className="text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
                  About Me
                </span>
              </div>

              <h2 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                {about.title}
              </h2>

              {about.profile_image && (
                <div className="mt-8">
                  <div className="h-32 w-32 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <img
                      src={about.profile_image}
                      alt={about.title}
                      className="block h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        const parent = event.currentTarget.parentElement;
                        if (parent) parent.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* RIGHT: DESCRIPTION */}
          <Reveal delay={120} y={24}>
            <div className="relative border-l-2 border-blue-500/40 pl-6 h-full flex flex-col justify-center">
              {about.short_description && (
                <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                  {about.short_description}
                </p>
              )}
              {about.long_description && (
                <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                  {about.long_description}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {/* =================================================
            BOTTOM SECTION: CARDS (2-COLUMN GRID)
        ================================================= */}

        {cards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((item, index) => (
              <AboutCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}