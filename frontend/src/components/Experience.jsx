import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

/* =========================================================
   COLOR STYLES (Same Palette as About/Projects/Skills)
========================================================= */
const cardStyles = [
  {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    accent: "bg-blue-500",
    border: "hover:border-blue-300 dark:hover:border-blue-500/50",
    tint: "hover:bg-blue-50/40 dark:hover:bg-blue-500/[0.08]",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    badge: "bg-blue-600 dark:bg-blue-500",
    pill: "group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-300",
    leftBar: "bg-gradient-to-b from-blue-500 to-indigo-500",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    border: "hover:border-violet-300 dark:hover:border-violet-500/50",
    tint: "hover:bg-violet-50/40 dark:hover:bg-violet-500/[0.08]",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    badge: "bg-violet-600 dark:bg-violet-500",
    pill: "group-hover:bg-violet-50 group-hover:text-violet-600 dark:group-hover:bg-violet-500/10 dark:group-hover:text-violet-300",
    leftBar: "bg-gradient-to-b from-violet-500 to-purple-500",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
    tint: "hover:bg-emerald-50/40 dark:hover:bg-emerald-500/[0.08]",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    badge: "bg-emerald-600 dark:bg-emerald-500",
    pill: "group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-300",
    leftBar: "bg-gradient-to-b from-emerald-500 to-teal-500",
  },
  {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    accent: "bg-orange-500",
    border: "hover:border-orange-300 dark:hover:border-orange-500/50",
    tint: "hover:bg-orange-50/40 dark:hover:bg-orange-500/[0.08]",
    text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    badge: "bg-orange-600 dark:bg-orange-500",
    pill: "group-hover:bg-orange-50 group-hover:text-orange-600 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-300",
    leftBar: "bg-gradient-to-b from-orange-500 to-amber-500",
  },
  {
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    accent: "bg-pink-500",
    border: "hover:border-pink-300 dark:hover:border-pink-500/50",
    tint: "hover:bg-pink-50/40 dark:hover:bg-pink-500/[0.08]",
    text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    badge: "bg-pink-600 dark:bg-pink-500",
    pill: "group-hover:bg-pink-50 group-hover:text-pink-600 dark:group-hover:bg-pink-500/10 dark:group-hover:text-pink-300",
    leftBar: "bg-gradient-to-b from-pink-500 to-rose-500",
  },
  {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/30",
    accent: "bg-indigo-500",
    border: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
    tint: "hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.08]",
    text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    badge: "bg-indigo-600 dark:bg-indigo-500",
    pill: "group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-300",
    leftBar: "bg-gradient-to-b from-indigo-500 to-blue-500",
  },
  {
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/50",
    tint: "hover:bg-cyan-50/40 dark:hover:bg-cyan-500/[0.08]",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    badge: "bg-cyan-600 dark:bg-cyan-500",
    pill: "group-hover:bg-cyan-50 group-hover:text-cyan-600 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-300",
    leftBar: "bg-gradient-to-b from-cyan-500 to-sky-500",
  },
  {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    border: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
    tint: "hover:bg-fuchsia-50/40 dark:hover:bg-fuchsia-500/[0.08]",
    text: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
    badge: "bg-fuchsia-600 dark:bg-fuchsia-500",
    pill: "group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600 dark:group-hover:bg-fuchsia-500/10 dark:group-hover:text-fuchsia-300",
    leftBar: "bg-gradient-to-b from-fuchsia-500 to-purple-500",
  },
];

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await api.get("/experience");
        setExperience(response.data);
      } catch (err) {
        console.error("Failed to load experience:", err);
        setError("Unable to load experience right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <section
      id="experience"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-white text-slate-900
        dark:bg-slate-950 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Heading — staggered reveal */}
        <div className="text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Experience
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              My professional journey.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Experience and roles that have helped me grow as a developer.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading experience...
            </div>
          </Reveal>
        )}

        {/* Error */}
        {!loading && error && (
          <Reveal delay={0} y={20}>
            <div className="
              mt-12 rounded-2xl border p-6 text-center
              border-red-200 bg-red-50
              dark:border-red-500/30 dark:bg-red-500/10
            ">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && experience.length === 0 && (
          <Reveal delay={0} y={20}>
            <div className="
              mt-12 rounded-2xl border p-8 text-center
              border-slate-200 bg-slate-50
              dark:border-slate-800 dark:bg-slate-900
            ">
              <p className="font-semibold text-slate-900 dark:text-white">
                No experience added yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Experience added through the CMS will appear here automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Timeline */}
        {!loading && !error && experience.length > 0 && (
          <div className="relative mt-14">
            {/* Timeline vertical line — fades in with the section */}
            <Reveal delay={0} y={0}>
              <div className="
                absolute left-5 top-0 hidden h-full w-px sm:block
                bg-slate-200 dark:bg-slate-800
              " />
            </Reveal>

            <div className="space-y-8">
              {experience.map((item, i) => {
                // Cycle through colors based on index
                const style = cardStyles[i % cardStyles.length];

                return (
                  <ExperienceCard
                    key={item.id}
                    item={item}
                    index={i}
                    style={style}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   EXPERIENCE CARD COMPONENT (WITH ANIMATIONS)
========================================================= */
function ExperienceCard({ item, index, style }) {
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
    
    const maxTilt = 4; // Reduced tilt for timeline cards
    setTilt({
      x: -yPct * maxTilt,
      y: xPct * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Reveal delay={index * 140} y={32}>
      <article className="relative sm:pl-14">
        
        {/* =================================================
            TIMELINE BADGE (COLORED)
        ================================================= */}
        <div
          className={`
            absolute left-0 top-1 hidden h-10 w-10 items-center justify-center rounded-full
            border-4 shadow sm:flex
            border-white text-white
            dark:border-slate-950
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${style.badge}
          `}
        >
          <Briefcase size={17} />
        </div>

        {/* =================================================
            CARD (WITH TILT, SHINE, & COLORS)
        ================================================= */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
          }}
          className={`
            group relative rounded-2xl border p-6
            border-slate-200 bg-slate-50
            dark:border-slate-800 dark:bg-slate-900
            ${style.border}
            ${style.tint}
            hover:shadow-[0_20px_45px_-20px_rgba(37,99,235,0.35)]
            dark:hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,0.45)]
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

          {/* Left accent bar on hover - COLORED */}
          <span
            aria-hidden="true"
            className={`
              pointer-events-none absolute left-0 top-6 bottom-6 w-[3px] rounded-full
              ${style.leftBar}
              opacity-0 transition-opacity duration-400
              group-hover:opacity-100
            `}
          />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {/* Position Title - COLORED HOVER */}
              <h3 className={`text-xl font-bold text-slate-900 transition-colors duration-300 dark:text-white ${style.text}`}>
                {item.position}
              </h3>

              <p className={`mt-1 font-medium transition-colors duration-300 ${style.text.replace('group-hover:', 'text-')}`}>
                {item.company}
              </p>
            </div>

            {/* Date pill - COLORED */}
            <div className={`
              inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium
              bg-white text-slate-500
              dark:bg-slate-950 dark:text-slate-400
              transition-all duration-300
              ${style.pill}
            `}>
              <Calendar size={14} />

              <span>
                {item.start_date || "Present"}{" "}
                –{" "}
                {item.is_current
                  ? "Present"
                  : item.end_date || "Present"}
              </span>
            </div>
          </div>

          {item.description && (
            <p className="relative z-10 mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          )}
        </div>
      </article>
    </Reveal>
  );
}