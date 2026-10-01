import { Code2, Database, Globe, Layers } from "lucide-react";
import { Reveal } from "./Hero"; // reuse the Reveal wrapper from Hero.jsx

const highlights = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "Responsive and modern interfaces built for web and mobile.",
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Scalable APIs and reliable server-side applications.",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Complete full-stack applications from frontend to deployment.",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    description:
      "Maintainable code organized around reusable components and services.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-slate-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          {/* Section Heading — reveals with fade-up */}
          <Reveal delay={0} y={28}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                About Me
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Turning ideas into useful digital products.
              </h2>
            </div>
          </Reveal>

          {/* About Content — staggered */}
          <div>
            <Reveal delay={120} y={24}>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                I am a developer focused on building practical, responsive, and
                scalable web applications. I enjoy working across both frontend
                and backend technologies and turning requirements into complete
                working products.
              </p>
            </Reveal>

            {/* Highlights — staggered card entrance */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {highlights.map((item, i) => {
                const Icon = item.icon;

                return (
                  <Reveal
                    key={item.title}
                    delay={240 + i * 110}
                    y={30}
                  >
                    <div
                      className="
                        group relative h-full rounded-2xl border p-5
                        border-slate-200 bg-white
                        dark:border-slate-800 dark:bg-slate-950
                        transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:-translate-y-1.5 hover:scale-[1.02]
                        hover:border-blue-300 hover:bg-blue-50/60
                        hover:shadow-[0_20px_45px_-20px_rgba(37,99,235,0.4)]
                        dark:hover:border-blue-500/50 dark:hover:bg-slate-800/60
                        dark:hover:shadow-[0_20px_45px_-20px_rgba(59,130,246,0.5)]
                      "
                    >
                      {/* Subtle inner glow on hover */}
                      <span
                        aria-hidden="true"
                        className="
                          pointer-events-none absolute inset-0 rounded-2xl
                          bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0
                          opacity-0 transition-opacity duration-400
                          group-hover:from-blue-500/[0.06] group-hover:to-indigo-500/[0.08]
                          group-hover:opacity-100
                        "
                      />

                      <div
                        className="
                          relative flex h-11 w-11 items-center justify-center rounded-xl
                          bg-blue-100 text-blue-600
                          dark:bg-blue-500/15 dark:text-blue-400
                          transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                          group-hover:scale-110 group-hover:rotate-3
                          group-hover:bg-blue-500 group-hover:text-white
                          dark:group-hover:bg-blue-500 dark:group-hover:text-white
                          group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
                        "
                      >
                        <Icon size={21} />
                      </div>

                      <h3 className="relative mt-4 font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>

                      <p className="relative mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}