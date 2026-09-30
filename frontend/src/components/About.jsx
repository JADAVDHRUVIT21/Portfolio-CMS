import { Code2, Database, Globe, Layers } from "lucide-react";

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
          {/* Section Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              About Me
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Turning ideas into useful digital products.
            </h2>
          </div>

          {/* About Content */}
          <div>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              I am a developer focused on building practical, responsive, and
              scalable web applications. I enjoy working across both frontend
              and backend technologies and turning requirements into complete
              working products.
            </p>

            {/* Highlights */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      rounded-2xl border p-5
                      border-slate-200 bg-white
                      hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/60
                      dark:border-slate-800 dark:bg-slate-950
                      dark:hover:border-blue-500/50 dark:hover:bg-slate-800/60
                      transition-all duration-300
                    "
                  >
                    <div className="
                      flex h-11 w-11 items-center justify-center rounded-xl
                      bg-blue-100 text-blue-600
                      dark:bg-blue-500/15 dark:text-blue-400
                    ">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}