import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import api from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import BlogModal from "./BlogModal";

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
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Blog
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Ideas, knowledge and insights.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Articles and technical notes published through the portfolio CMS.
          </p>
        </div>

        {loading && (
          <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading blog posts...
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

        {!loading && !error && blogs.length === 0 && (
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
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => {
              const cover = resolveImageUrl(blog.featured_image);

              return (
                <button
                  key={blog.id}
                  type="button"
                  onClick={() => setActiveBlog(blog)}
                  className="
                    group text-left w-full overflow-hidden rounded-2xl border
                    border-slate-200 bg-white
                    hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg
                    dark:border-slate-800 dark:bg-slate-950
                    dark:hover:border-blue-500/50 dark:hover:shadow-2xl
                    transition duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  "
                >
                  {cover && (
                    <div className="h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={cover}
                        alt={blog.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString()
                        : "Article"}
                    </p>

                    <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="
                      mt-6 inline-flex items-center gap-2 text-sm font-semibold
                      text-blue-600
                      dark:text-blue-400
                    ">
                      Read article
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </button>
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