import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import api from "../services/api";
import { Reveal } from "./Hero";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section
      id="services"
      className="
        scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32
        bg-white text-slate-900
        dark:bg-slate-950 dark:text-slate-100
        transition-colors duration-300
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading — staggered reveal */}
        <div className="text-center">
          <Reveal delay={0} y={20}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Services
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What I can build for you.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Practical development services focused on creating reliable and
              modern digital products.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading services...
            </div>
          </Reveal>
        )}

        {/* Error */}
        {!loading && error && (
          <Reveal delay={0} y={20}>
            <div className="
              mx-auto mt-12 max-w-xl rounded-2xl border p-6 text-center
              border-red-200 bg-red-50
              dark:border-red-500/30 dark:bg-red-500/10
            ">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Reveal>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <Reveal delay={0} y={20}>
            <div className="
              mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
              border-slate-200 bg-slate-50
              dark:border-slate-800 dark:bg-slate-900
            ">
              <p className="font-semibold text-slate-900 dark:text-white">
                No services added yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Services added through the CMS will appear here automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Services grid — staggered card entrance + hover lift */}
        {!loading && !error && services.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal
                key={service.id}
                delay={i * 110}
                y={32}
                className="h-full"
              >
                <article
                  className="
                    group relative h-full rounded-2xl border p-7
                    border-slate-200 bg-slate-50
                    dark:border-slate-800 dark:bg-slate-900
                    transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                    hover:-translate-y-2 hover:scale-[1.015]
                    hover:border-blue-300 hover:bg-blue-50/40
                    hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)]
                    dark:hover:border-blue-500/50 dark:hover:bg-slate-800/70
                    dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]
                  "
                >
                  {/* Soft gradient overlay on hover */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-0 rounded-2xl
                      bg-gradient-to-br from-blue-500/0 to-indigo-500/0
                      opacity-0 transition-opacity duration-400
                      group-hover:from-blue-500/[0.05] group-hover:to-indigo-500/[0.07]
                      group-hover:opacity-100
                    "
                  />

                  {/* Top-right corner accent dot */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rounded-full
                      bg-blue-500
                      opacity-0 transition-all duration-500
                      group-hover:opacity-100
                      group-hover:shadow-[0_0_12px_rgba(59,130,246,0.9)]
                    "
                  />

                  <div
                    className="
                      relative flex h-12 w-12 items-center justify-center rounded-xl
                      bg-blue-100 text-blue-600
                      dark:bg-blue-500/15 dark:text-blue-400
                      transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:scale-110 group-hover:rotate-3
                      group-hover:bg-blue-500 group-hover:text-white
                      dark:group-hover:bg-blue-500 dark:group-hover:text-white
                      group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]
                    "
                  >
                    <Layers size={22} />
                  </div>

                  <h3 className="relative mt-6 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {service.title}
                  </h3>

                  {service.description && (
                    <p className="relative mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {service.description}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}