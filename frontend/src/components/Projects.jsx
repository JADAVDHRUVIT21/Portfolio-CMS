import { useEffect, useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";
import api from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import { Reveal } from "./Hero";

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
        {/* Section Header — staggered reveal */}
        <div className="max-w-2xl">
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
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
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

        {/* Projects grid — staggered card entrance + hover lift */}
        {!loading && !error && projects.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const imageSrc = resolveImageUrl(project.image);

              return (
                <Reveal
                  key={project.id}
                  delay={i * 110}
                  y={36}
                  className="h-full"
                >
                  <article
                    className="
                      group relative h-full flex flex-col overflow-hidden rounded-2xl border shadow-sm
                      border-slate-200 bg-white
                      dark:border-slate-800 dark:bg-slate-900
                      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                      hover:-translate-y-2 hover:scale-[1.015]
                      hover:border-blue-300 hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)]
                      dark:hover:border-blue-500/50 dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]
                    "
                  >
                    {/* Soft top-edge accent on hover */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px]
                        bg-gradient-to-r from-blue-500/0 via-blue-500 to-indigo-500/0
                        opacity-0 transition-opacity duration-500
                        group-hover:opacity-100
                      "
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
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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
                                className="
                                  rounded-full px-3 py-1 text-xs font-medium
                                  bg-blue-50 text-blue-600
                                  dark:bg-blue-500/15 dark:text-blue-300
                                  transition-all duration-300
                                  group-hover:bg-blue-100
                                  dark:group-hover:bg-blue-500/25
                                "
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
                            className="
                              inline-flex items-center gap-2 rounded-xl
                              bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                              transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                              hover:bg-blue-500 hover:-translate-y-0.5 hover:scale-[1.03]
                              hover:shadow-[0_10px_25px_-8px_rgba(37,99,235,0.7)]
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                            "
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
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}