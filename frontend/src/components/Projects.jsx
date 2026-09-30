import { useEffect, useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";
import api from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";

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
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            My Work
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Projects I have built.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            A selection of projects built using modern frontend, backend, and
            database technologies.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="
            mt-12 rounded-2xl border p-8 text-center
            border-slate-200 bg-white
            dark:border-slate-800 dark:bg-slate-900
          ">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading projects...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="
            mt-12 rounded-2xl border p-8 text-center
            border-red-200 bg-red-50
            dark:border-red-500/30 dark:bg-red-500/10
          ">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && projects.length === 0 && (
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
        )}

        {/* Projects */}
        {!loading && !error && projects.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              // Resolve once per render — handles relative /uploads/... paths
              const imageSrc = resolveImageUrl(project.image);

              return (
                <article
                  key={project.id}
                  className="
                    group overflow-hidden rounded-2xl border shadow-sm
                    border-slate-200 bg-white
                    dark:border-slate-800 dark:bg-slate-900
                    transition duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    dark:hover:border-slate-700 dark:hover:shadow-2xl
                  "
                >
                  {/* Image */}
                  {imageSrc ? (
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={imageSrc}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback if the file 404s — hide the broken img,
                          // reveal a "No image" placeholder via sibling
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
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
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
                              "
                            >
                              {technology.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex items-center gap-2 rounded-xl
                            bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                            transition hover:bg-blue-500
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
                            transition
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}