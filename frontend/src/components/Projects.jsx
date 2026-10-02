import { useEffect, useRef, useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";
import api from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import { Reveal } from "./Hero";

/* =========================================================
   COLOR STYLES (Same as About Page)
========================================================= */
const cardStyles = [
  {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    accent: "bg-blue-500",
    border: "hover:border-blue-300 dark:hover:border-blue-500/50",
    tint: "hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.08]",
    text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    accent: "bg-violet-500",
    border: "hover:border-violet-300 dark:hover:border-violet-500/50",
    tint: "hover:bg-violet-50/60 dark:hover:bg-violet-500/[0.08]",
    text: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-300 dark:hover:border-emerald-500/50",
    tint: "hover:bg-emerald-50/60 dark:hover:bg-emerald-500/[0.08]",
    text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
  },
  {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    accent: "bg-orange-500",
    border: "hover:border-orange-300 dark:hover:border-orange-500/50",
    tint: "hover:bg-orange-50/60 dark:hover:bg-orange-500/[0.08]",
    text: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
  },
  {
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    accent: "bg-pink-500",
    border: "hover:border-pink-300 dark:hover:border-pink-500/50",
    tint: "hover:bg-pink-50/60 dark:hover:bg-pink-500/[0.08]",
    text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
  },
  {
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/30",
    accent: "bg-indigo-500",
    border: "hover:border-indigo-300 dark:hover:border-indigo-500/50",
    tint: "hover:bg-indigo-50/60 dark:hover:bg-indigo-500/[0.08]",
    text: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
  },
  {
    gradient: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    accent: "bg-cyan-500",
    border: "hover:border-cyan-300 dark:hover:border-cyan-500/50",
    tint: "hover:bg-cyan-50/60 dark:hover:bg-cyan-500/[0.08]",
    text: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
  },
  {
    gradient: "from-fuchsia-500 to-purple-600",
    glow: "shadow-fuchsia-500/30",
    accent: "bg-fuchsia-500",
    border: "hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50",
    tint: "hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-500/[0.08]",
    text: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Unable to load projects right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-white text-slate-900
        dark:bg-slate-950 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header — CENTERED */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              My Work
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Projects I have built.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              A selection of projects built using modern frontend, backend, and
              database technologies.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="
              mt-12 rounded-2xl border p-8 text-center
              border-slate-200 bg-white
              dark:border-slate-800 dark:bg-slate-900
            ">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading projects...
              </p>
            </div>
          </Reveal>
        )}

        {/* Error */}
        {!loading && error && (
          <Reveal delay={0} y={20}>
            <div className="
              mt-12 rounded-2xl border p-8 text-center
              border-red-200 bg-red-50
              dark:border-red-500/30 dark:bg-red-500/10
            ">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
          <Reveal delay={0} y={20}>
            <div className="
              mt-12 rounded-2xl border p-10 text-center
              border-slate-200 bg-white
              dark:border-slate-800 dark:bg-slate-900
            ">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                No projects available yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Projects published from the CMS will appear here automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Projects grid — with Colorful Tilt, Shine Sweep, and Smooth Lift */}
        {!loading && !error && projects.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const imageSrc = resolveImageUrl(project.image);
              // Cycle through colors based on index
              const style = cardStyles[i % cardStyles.length];

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  imageSrc={imageSrc}
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
   PROJECT CARD COMPONENT (WITH COLORFUL ANIMATIONS)
========================================================= */
function ProjectCard({ project, imageSrc, index, style }) {
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
    <Reveal delay={index * 110} y={36} className="h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
        className={`
          group relative h-full flex flex-col overflow-hidden rounded-2xl border shadow-sm
          border-slate-200 bg-white
          dark:border-slate-800 dark:bg-slate-900
          transition-all duration-500
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
            pointer-events-none absolute inset-0 z-20
            bg-gradient-to-tr from-transparent via-white/10 to-transparent
            opacity-0 group-hover:opacity-100
            -translate-x-full group-hover:translate-x-full
            transition-all duration-1000 ease-out
            dark:via-white/[0.03]
          "
        />

        {/* Soft top-edge accent on hover - COLORED */}
        <span
          aria-hidden="true"
          className={`
            pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px]
            bg-gradient-to-r from-transparent via-current to-transparent
            opacity-0 transition-opacity duration-500
            group-hover:opacity-100
            ${style.accent.replace('bg-', 'text-')}
          `}
        />

        {/* Image */}
        {imageSrc ? (
          <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={imageSrc}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector("[data-fallback]")) {
                  const fallback = document.createElement("div");
                  fallback.setAttribute("data-fallback", "true");
                  fallback.className =
                    "flex h-full w-full items-center justify-center text-sm text-slate-400 dark:text-slate-500";
                  fallback.textContent = "Image unavailable";
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-slate-100 dark:bg-slate-800">
            <span className="text-sm text-slate-400 dark:text-slate-500">
              No image
            </span>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col p-6">
          {/* TITLE - COLOR CHANGES ON HOVER */}
          <h3 className={`text-xl font-bold text-slate-900 transition-colors duration-300 dark:text-white ${style.text}`}>
            {project.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies
                .split(",")
                .map((technology) => (
                  <span
                    key={technology.trim()}
                    className={`
                      rounded-full px-3 py-1 text-xs font-medium
                      bg-slate-100 text-slate-600
                      dark:bg-slate-800 dark:text-slate-300
                      transition-all duration-300
                      ${style.tint.replace('hover:bg-', 'group-hover:bg-').replace('dark:hover:bg-', 'dark:group-hover:bg-')}
                      ${style.text.replace('group-hover:text-', 'group-hover:text-')}
                    `}
                  >
                    {technology.trim()}
                  </span>
                ))}
            </div>
          )}

          {/* Links — pinned to bottom */}
          <div className="mt-auto pt-6 flex flex-wrap gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className={`
                  inline-flex items-center gap-2 rounded-xl
                  px-4 py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r ${style.gradient}
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  hover:-translate-y-0.5 hover:scale-[1.03]
                  hover:shadow-[0_10px_25px_-8px_rgba(37,99,235,0.7)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                `}
              >
                Live Demo
                <ExternalLink size={16} />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold
                  border-slate-200 text-slate-700 hover:bg-slate-50
                  dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  hover:-translate-y-0.5 hover:scale-[1.03]
                  hover:border-slate-300
                  dark:hover:border-slate-600
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                GitHub
                <GitBranch size={16} />
              </a>
            )}
          </div>
        </div>
        
        {/* Bottom Accent Line - COLORED */}
        <div
          className={`
            absolute bottom-0 left-0 h-[3px] w-0
            ${style.accent}
            transition-all duration-500
            group-hover:w-full
          `}
        />
      </div>
    </Reveal>
  );
}