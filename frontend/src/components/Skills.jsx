import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

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
              // Backend field is "proficiency"
              const proficiency = Math.min(
                100,
                Math.max(0, Number(skill.proficiency ?? 0))
              );

              return (
                <Reveal
                  key={skill.id}
                  delay={i * 80}
                  y={30}
                  className="h-full"
                >
                  <article
                    className="
                      group relative h-full rounded-2xl border p-6
                      border-slate-200 bg-white
                      dark:border-slate-800 dark:bg-slate-950
                      transition-all duration-400
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      hover:-translate-y-1.5 hover:scale-[1.02]
                      hover:border-blue-300
                      hover:shadow-[0_20px_45px_-20px_rgba(37,99,235,0.4)]
                      dark:hover:border-blue-500/50
                      dark:hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,0.5)]
                    "
                  >
                    {/* Hover gradient */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute inset-0 rounded-2xl
                        bg-gradient-to-br from-blue-500/0 to-indigo-500/0
                        opacity-0 transition-opacity duration-400
                        group-hover:from-blue-500/[0.06]
                        group-hover:to-indigo-500/[0.08]
                        group-hover:opacity-100
                      "
                    />

                    {/* Icon */}
                    <div
                      className="
                        relative flex h-12 w-12 items-center justify-center
                        rounded-xl bg-blue-100 text-blue-600
                        dark:bg-blue-500/15 dark:text-blue-400
                        transition-all duration-400
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:scale-110
                        group-hover:rotate-3
                        group-hover:bg-blue-500
                        group-hover:text-white
                        dark:group-hover:bg-blue-500
                        dark:group-hover:text-white
                        group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
                      "
                    >
                      <Code2 size={22} />
                    </div>

                    {/* Skill name + proficiency */}
                    <div className="relative mt-5 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </h3>

                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {proficiency}%
                      </span>
                    </div>

                    {/* Category */}
                    {skill.category && (
                      <p className="relative mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                        {skill.category}
                      </p>
                    )}

                    {/* Description */}
                    {skill.description && (
                      <p className="relative mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {skill.description}
                      </p>
                    )}

                    {/* Skill Progress */}
                    <div className="relative mt-6">
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
                          className="
                            h-full rounded-full
                            bg-gradient-to-r
                            from-blue-500
                            via-cyan-400
                            to-indigo-500
                            shadow-[0_0_14px_rgba(59,130,246,0.45)]
                            transition-all duration-1000
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]
                          "
                          style={{
                            width: `${proficiency}%`,
                          }}
                        />
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