import { useEffect, useRef, useState } from "react";
import { Code2 } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

/* =========================================================
   COLOR STYLES (Same Palette as About/Projects)
========================================================= */
const cardStyles = [
  {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    accent: "bg-blue-500",
    border: "hover:border-blue-300 dark:hover:border-blue-500/50",
    borderGradient: "from-blue-500 via-cyan-400 to-indigo-500",
    tint: "hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.08]",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    progress: "from-blue-500 via-cyan-400 to-indigo-500",
    progressShadow: "shadow-[0_0_14px_rgba(59,130,246,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    border: "hover:border-violet-300 dark:hover:border-violet-500/50",
    borderGradient: "from-violet-500 via-fuchsia-400 to-purple-600",
    tint: "hover:bg-violet-50/60 dark:hover:bg-violet-500/[0.08]",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    progress: "from-violet-500 via-fuchsia-400 to-purple-600",
    progressShadow: "shadow-[0_0_14px_rgba(139,92,246,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
    borderGradient: "from-emerald-500 via-teal-400 to-cyan-600",
    tint: "hover:bg-emerald-50/60 dark:hover:bg-emerald-500/[0.08]",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    progress: "from-emerald-500 via-teal-400 to-cyan-600",
    progressShadow: "shadow-[0_0_14px_rgba(16,185,129,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.7)]",
  },
  {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    accent: "bg-orange-500",
    border: "hover:border-orange-300 dark:hover:border-orange-500/50",
    borderGradient: "from-orange-500 via-amber-400 to-yellow-500",
    tint: "hover:bg-orange-50/60 dark:hover:bg-orange-500/[0.08]",
    text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    progress: "from-orange-500 via-amber-400 to-yellow-500",
    progressShadow: "shadow-[0_0_14px_rgba(249,115,22,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]",
  },
  {
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    accent: "bg-pink-500",
    border: "hover:border-pink-300 dark:hover:border-pink-500/50",
    borderGradient: "from-pink-500 via-rose-400 to-fuchsia-600",
    tint: "hover:bg-pink-50/60 dark:hover:bg-pink-500/[0.08]",
    text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    progress: "from-pink-500 via-rose-400 to-fuchsia-600",
    progressShadow: "shadow-[0_0_14px_rgba(236,72,153,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]",
  },
  {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/30",
    accent: "bg-indigo-500",
    border: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
    borderGradient: "from-indigo-500 via-blue-400 to-sky-600",
    tint: "hover:bg-indigo-50/60 dark:hover:bg-indigo-500/[0.08]",
    text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    progress: "from-indigo-500 via-blue-400 to-sky-600",
    progressShadow: "shadow-[0_0_14px_rgba(99,102,241,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.7)]",
  },
  {
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/50",
    borderGradient: "from-cyan-500 via-sky-400 to-blue-600",
    tint: "hover:bg-cyan-50/60 dark:hover:bg-cyan-500/[0.08]",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    progress: "from-cyan-500 via-sky-400 to-blue-600",
    progressShadow: "shadow-[0_0_14px_rgba(6,182,212,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)]",
  },
  {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    border: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
    borderGradient: "from-fuchsia-500 via-pink-400 to-purple-600",
    tint: "hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-500/[0.08]",
    text: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
    progress: "from-fuchsia-500 via-pink-400 to-purple-600",
    progressShadow: "shadow-[0_0_14px_rgba(217,70,239,0.45)]",
    progressShadowHover: "group-hover:shadow-[0_0_20px_rgba(217,70,239,0.7)]",
  },
];

/* =========================================================
   ICON RENDERER
========================================================= */
function SkillIcon({ icon, className }) {
  const [imageError, setImageError] = useState(false);

  const isUrl =
    icon &&
    typeof icon === "string" &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://") ||
      icon.startsWith("data:image/"));

  if (isUrl && !imageError) {
    return (
      <img
        src={icon}
        alt="Skill icon"
        className={`${className} object-contain p-1`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
      />
    );
  }

  return <Code2 size={22} />;
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/skills");
        setSkills(response.data);
      } catch (err) {
        console.error("Failed to load skills:", err);
        setError("Unable to load skills right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section
      id="skills"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-slate-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Skills
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Technologies I work with.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              A collection of technologies and tools I use to build modern
              applications.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading skills...
          </div>
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
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && skills.length === 0 && (
          <Reveal delay={0} y={20}>
            <div
              className="
                mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
                border-slate-200 bg-white
                dark:border-slate-800 dark:bg-slate-950
              "
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                No skills added yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Skills added through the CMS will appear here automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Skills */}
        {!loading && !error && skills.length > 0 && (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map((skill, i) => {
              const proficiency = Math.min(
                100,
                Math.max(0, Number(skill.proficiency ?? 0))
              );
              // Cycle through colors based on index
              const style = cardStyles[i % cardStyles.length];

              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={i}
                  style={style}
                  proficiency={proficiency}
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
   SKILL CARD COMPONENT (WITH ABOUT PAGE ANIMATIONS)
========================================================= */
function SkillCard({ skill, index, style, proficiency }) {
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
    <Reveal delay={index * 80} y={30} className="h-full">
      {/* Gradient Border Wrapper - visible on mobile, subtle on desktop */}
      <div
        className={`
          group relative h-full rounded-2xl p-[1.5px]
          bg-gradient-to-br ${style.borderGradient}
          sm:p-[1px] sm:bg-slate-200 dark:sm:bg-slate-800
          sm:group-hover:bg-gradient-to-br sm:group-hover:${style.borderGradient}
          transition-all duration-500
          shadow-[0_4px_20px_-6px_rgba(0,0,0,0.15)]
          sm:shadow-none
          sm:group-hover:shadow-[0_20px_45px_-20px_rgba(37,99,235,0.4)]
          dark:sm:group-hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,0.5)]
        `}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition:
              "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
          }}
          className={`
            relative h-full rounded-2xl border-0 p-6
            bg-white
            dark:bg-slate-950
            ${style.tint}
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

          {/* Hover gradient */}
          <span
            aria-hidden="true"
            className={`
              pointer-events-none absolute inset-0 rounded-2xl
              bg-gradient-to-br opacity-0 transition-opacity duration-400
              group-hover:opacity-100
              ${style.gradient.replace("from-", "group-hover:from-").replace("to-", "group-hover:to-")}
            `}
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          />

          {/* Icon */}
          <div
            className="
              relative z-20 flex h-12 w-12 items-center justify-center
              rounded-xl bg-white dark:bg-slate-900
              border border-slate-100 dark:border-slate-800
              shadow-sm
              transition-all duration-400
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-110
              group-hover:rotate-3
              overflow-hidden
            "
          >
            <SkillIcon
              icon={skill.icon}
              className={`h-full w-full ${style.text.replace("group-hover:", "text-")}`}
            />
          </div>

          {/* Skill name + proficiency */}
          <div className="relative z-20 mt-5 flex items-center justify-between gap-3">
            <h3
              className={`text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300 ${style.text}`}
            >
              {skill.name}
            </h3>

            <span
              className={`text-sm font-bold transition-colors duration-300 ${style.text.replace("group-hover:", "text-")}`}
            >
              {proficiency}%
            </span>
          </div>

          {/* Category */}
          {skill.category && (
            <p
              className={`relative z-20 mt-2 text-sm font-medium transition-colors duration-300 ${style.text.replace("group-hover:", "text-")}`}
            >
              {skill.category}
            </p>
          )}

          {/* Description */}
          {skill.description && (
            <p className="relative z-20 mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {skill.description}
            </p>
          )}

          {/* Skill Progress */}
          <div className="relative z-20 mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Proficiency
              </span>

              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {proficiency}%
              </span>
            </div>

            {/* Background line */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              {/* Colorful progress */}
              <div
                className={`
                  h-full rounded-full
                  bg-gradient-to-r
                  ${style.progress}
                  ${style.progressShadow}
                  transition-all duration-1000
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${style.progressShadowHover}
                `}
                style={{
                  width: `${proficiency}%`,
                }}
              />
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div
            className={`
              absolute bottom-0 left-0 h-[3px] w-0 z-20
              ${style.accent}
              transition-all duration-500
              group-hover:w-full
            `}
          />
        </div>
      </div>
    </Reveal>
  );
}