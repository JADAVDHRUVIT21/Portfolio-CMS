import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import api from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import BlogModal from "./BlogModal";
import { Reveal } from "./Hero";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError("Unable to load blog posts right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section
      id="blog"
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
              Blog
            </p>
          </Reveal>

          <Reveal delay={120} y={28}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Ideas, knowledge and insights.
            </h2>
          </Reveal>

          <Reveal delay={240} y={24}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Articles and technical notes published through the portfolio CMS.
            </p>
          </Reveal>
        </div>

        {/* Loading */}
        {loading && (
          <Reveal delay={0} y={20}>
            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading blog posts...
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
        {!loading && !error && blogs.length === 0 && (
          <Reveal delay={0} y={20}>
            <div className="
              mx-auto mt-12 max-w-xl rounded-2xl border p-8 text-center
              border-slate-200 bg-slate-50
              dark:border-slate-800 dark:bg-slate-900
            ">
              <div className="
                mx-auto flex h-12 w-12 items-center justify-center rounded-xl
                bg-blue-100 text-blue-600
                dark:bg-blue-500/15 dark:text-blue-400
              ">
                <BookOpen size={22} />
              </div>

              <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                No blog posts published yet.
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Published articles added through the CMS will appear here
                automatically.
              </p>
            </div>
          </Reveal>
        )}

        {/* Blog grid — staggered card entrance + hover lift */}
        {!loading && !error && blogs.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => {
              const cover = resolveImageUrl(blog.featured_image);

              return (
                <Reveal
                  key={blog.id}
                  delay={i * 120}
                  y={34}
                  className="h-full"
                >
                  <button
                    type="button"
                    onClick={() => setActiveBlog(blog)}
                    className="
                      group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left
                      border-slate-200 bg-white
                      dark:border-slate-800 dark:bg-slate-950
                      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                      hover:-translate-y-2 hover:scale-[1.015]
                      hover:border-blue-300
                      hover:shadow-[0_25px_50px_-20px_rgba(37,99,235,0.35)]
                      dark:hover:border-blue-500/50
                      dark:hover:shadow-[0_25px_50px_-20px_rgba(59,130,246,0.45)]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                    "
                  >
                    {/* Top gradient accent on hover */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px]
                        bg-gradient-to-r from-blue-500/0 via-blue-500 to-indigo-500/0
                        opacity-0 transition-opacity duration-500
                        group-hover:opacity-100
                      "
                    />

                    {cover && (
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={cover}
                          alt={blog.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                        />

                        {/* Image vignette on hover */}
                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none absolute inset-0
                            bg-gradient-to-t from-black/30 via-transparent to-transparent
                            opacity-0 transition-opacity duration-500
                            group-hover:opacity-100
                          "
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString()
                          : "Article"}
                      </p>

                      <h3 className="mt-3 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {blog.title}
                      </h3>

                      {blog.excerpt && (
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                          {blog.excerpt}
                        </p>
                      )}

                      {/* CTA — pinned to bottom */}
                      <div className="
                        mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold
                        text-blue-600
                        dark:text-blue-400
                      ">
                        Read article
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {/* iOS-style modal */}
      <BlogModal blog={activeBlog} onClose={() => setActiveBlog(null)} />
    </section>
  );
}