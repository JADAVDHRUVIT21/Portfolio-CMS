import { useEffect, useRef, useState } from "react";
import { Layers } from "lucide-react";
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
    dot: "bg-blue-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(59,130,246,0.9)]",
    iconHover: "group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500",
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
    dot: "bg-violet-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(139,92,246,0.9)]",
    iconHover: "group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500",
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
    dot: "bg-emerald-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(16,185,129,0.9)]",
    iconHover: "group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500",
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
    dot: "bg-orange-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(249,115,22,0.9)]",
    iconHover: "group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500",
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
    dot: "bg-pink-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(236,72,153,0.9)]",
    iconHover: "group-hover:bg-pink-500 group-hover:text-white dark:group-hover:bg-pink-500",
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
    dot: "bg-indigo-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(99,102,241,0.9)]",
    iconHover: "group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500",
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
    dot: "bg-cyan-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(6,182,212,0.9)]",
    iconHover: "group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:bg-cyan-500",
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
    dot: "bg-fuchsia-500",
    dotGlow: "group-hover:shadow-[0_0_12px_rgba(217,70,239,0.9)]",
    iconHover: "group-hover:bg-fuchsia-500 group-hover:text-white dark:group-hover:bg-fuchsia-500",
  },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-white text-slate-900
        dark:bg-slate-950 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading — staggered reveal */}
        <div className="text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Services
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What I can build for you.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Practical development services focused on creating reliable and
              modern digital products.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading services...
            </div>
          </Reveal>
        )}

        {/* Error */}
        {!loading && error && (
          <Reveal delay={0} y={20}>
            <div className="
              mx-auto mt-12 max-w-xl rounded-2xl border p-6 text-center
              border-red-200 bg-red-50
              dark:border-red-500/30 dark:bg-red-500/10
            ">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <Reveal delay={0} y={20}>
            <div className="
              mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
              border-slate-200 bg-slate-50
              dark:border-slate-800 dark:bg-slate-900
            ">
              <p className="font-semibold text-slate-900 dark:text-white">
                No services added yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Services added through the CMS will appear here automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Services grid — with 3D Tilt, Shine Sweep, & Colors */}
        {!loading && !error && services.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              // Cycle through colors based on index
              const style = cardStyles[i % cardStyles.length];

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={i}
                  style={style}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SERVICE CARD COMPONENT (WITH ANIMATIONS)
========================================================= */
function ServiceCard({ service, index, style }) {
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
    <Reveal delay={index * 110} y={32} className="h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
        }}
        className={`
          group relative h-full rounded-2xl border p-7
          border-slate-200 bg-slate-50
          dark:border-slate-800 dark:bg-slate-900
          ${style.border}
          ${style.tint}
          hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)]
          dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]
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

        {/* Top-right corner accent dot - COLORED */}
        <span
          aria-hidden="true"
          className={`
            pointer-events-none absolute right-5 top-5 z-20 h-1.5 w-1.5 rounded-full
            ${style.dot}
            opacity-0 transition-all duration-500
            group-hover:opacity-100
            ${style.dotGlow}
          `}
        />

        {/* Icon - COLORED */}
        <div
          className={`
            relative z-20 flex h-12 w-12 items-center justify-center rounded-xl
            ${style.iconBg} ${style.iconText}
            transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-110 group-hover:rotate-3
            ${style.iconHover}
            group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
          `}
        >
          <Layers size={22} />
        </div>

        {/* Title - COLORED HOVER */}
        <h3 className={`relative z-20 mt-6 text-xl font-bold text-slate-900 transition-colors duration-300 dark:text-white ${style.text}`}>
          {service.title}
        </h3>

        {service.description && (
          <p className="relative z-20 mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            {service.description}
          </p>
        )}
      </div>
    </Reveal>
  );
}