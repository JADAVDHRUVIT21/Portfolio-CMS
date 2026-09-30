import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import api from "../services/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response.data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setError("Unable to load testimonials right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
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
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            What people say.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Feedback and experiences shared by people I have worked with.
          </p>
        </div>

        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading testimonials...
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

        {!loading && !error && testimonials.length === 0 && (
          <div className="
            mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
            border-slate-200 bg-white
            dark:border-slate-800 dark:bg-slate-950
          ">
            <p className="font-semibold text-slate-900 dark:text-white">
              No testimonials added yet.
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Testimonials added through the CMS will appear here
              automatically.
            </p>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="
                  rounded-2xl border p-7 shadow-sm
                  border-slate-200 bg-white
                  hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg
                  dark:border-slate-800 dark:bg-slate-950
                  dark:hover:border-blue-500/50 dark:hover:shadow-2xl
                  transition duration-300
                "
              >
                <div className="
                  flex h-11 w-11 items-center justify-center rounded-xl
                  bg-blue-100 text-blue-600
                  dark:bg-blue-500/15 dark:text-blue-400
                ">
                  <Quote size={21} />
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  “{testimonial.message}”
                </p>

                <div className="mt-7 flex items-center gap-4">
                  {testimonial.profile_image ? (
                    <img
                      src={testimonial.profile_image}
                      alt={testimonial.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="
                      flex h-11 w-11 items-center justify-center rounded-full font-bold
                      bg-blue-100 text-blue-600
                      dark:bg-blue-500/15 dark:text-blue-400
                    ">
                      {testimonial.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h3>

                    {(testimonial.role || testimonial.company) && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>
                </div>

                {testimonial.rating && (
                  <div className="mt-5 text-sm font-medium text-amber-500 dark:text-amber-400">
                    {"★".repeat(Math.min(5, testimonial.rating))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}