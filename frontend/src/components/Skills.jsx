import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import api from "../services/api";

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
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Skills
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Technologies I work with.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            A collection of technologies and tools I use to build modern
            applications.
          </p>
        </div>

        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading skills...
          </div>
        )}

        {!loading && error && (
          <div className="
            mx-auto mt-12 max-w-xl rounded-2xl border p-6 text-center
            border-red-200 bg-red-50
            dark:border-red-500/30 dark:bg-red-500/10
          ">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="
            mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
            border-slate-200 bg-white
            dark:border-slate-800 dark:bg-slate-950
          ">
            <p className="font-semibold text-slate-900 dark:text-white">
              No skills added yet.
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Skills added through the CMS will appear here automatically.
            </p>
          </div>
        )}

        {!loading && !error && skills.length > 0 && (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className="
                  rounded-2xl border p-6
                  border-slate-200 bg-white
                  hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg
                  dark:border-slate-800 dark:bg-slate-950
                  dark:hover:border-blue-500/50 dark:hover:shadow-2xl
                  transition duration-300
                "
              >
                <div className="
                  flex h-12 w-12 items-center justify-center rounded-xl
                  bg-blue-100 text-blue-600
                  dark:bg-blue-500/15 dark:text-blue-400
                ">
                  <Code2 size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {skill.name}
                </h3>

                {skill.category && (
                  <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {skill.category}
                  </p>
                )}

                {skill.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {skill.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}