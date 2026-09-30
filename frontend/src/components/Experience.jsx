import { useEffect, useState } from "react";
import { Briefcase, Calendar } from "lucide-react";
import api from "../services/api";

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
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Experience
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            My professional journey.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Experience and roles that have helped me grow as a developer.
          </p>
        </div>

        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading experience...
          </div>
        )}

        {!loading && error && (
          <div className="
            mt-12 rounded-2xl border p-6 text-center
            border-red-200 bg-red-50
            dark:border-red-500/30 dark:bg-red-500/10
          ">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && experience.length === 0 && (
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
        )}

        {!loading && !error && experience.length > 0 && (
          <div className="relative mt-14">
            {/* Timeline vertical line */}
            <div className="
              absolute left-5 top-0 hidden h-full w-px sm:block
              bg-slate-200 dark:bg-slate-800
            " />

            <div className="space-y-8">
              {experience.map((item) => (
                <article key={item.id} className="relative sm:pl-14">
                  {/* Timeline badge */}
                  <div className="
                    absolute left-0 top-1 hidden h-10 w-10 items-center justify-center rounded-full
                    border-4 shadow sm:flex
                    border-white bg-blue-600 text-white
                    dark:border-slate-950 dark:bg-blue-500
                  ">
                    <Briefcase size={17} />
                  </div>

                  {/* Card */}
                  <div className="
                    rounded-2xl border p-6
                    border-slate-200 bg-slate-50
                    hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/40
                    dark:border-slate-800 dark:bg-slate-900
                    dark:hover:border-blue-500/50 dark:hover:bg-slate-800/70
                    transition duration-300
                  ">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {item.position}
                        </h3>

                        <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
                          {item.company}
                        </p>
                      </div>

                      {/* Date pill */}
                      <div className="
                        inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium
                        bg-white text-slate-500
                        dark:bg-slate-950 dark:text-slate-400
                      ">
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
                      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}