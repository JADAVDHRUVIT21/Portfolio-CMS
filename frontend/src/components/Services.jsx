import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import api from "../services/api";

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
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Services
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            What I can build for you.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Practical development services focused on creating reliable and
            modern digital products.
          </p>
        </div>

        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading services...
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

        {!loading && !error && services.length === 0 && (
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
        )}

        {!loading && !error && services.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="
                  rounded-2xl border p-7
                  border-slate-200 bg-slate-50
                  hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-lg
                  dark:border-slate-800 dark:bg-slate-900
                  dark:hover:border-blue-500/50 dark:hover:bg-slate-800/70 dark:hover:shadow-2xl
                  transition duration-300
                "
              >
                <div className="
                  flex h-12 w-12 items-center justify-center rounded-xl
                  bg-blue-100 text-blue-600
                  dark:bg-blue-500/15 dark:text-blue-400
                ">
                  <Layers size={22} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h3>

                {service.description && (
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {service.description}
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