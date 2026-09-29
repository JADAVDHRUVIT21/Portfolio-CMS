import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  FileText,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  is_published: true,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    success,
    error: showError,
  } = useNotification();

  // --------------------------------------------------
  // Load Blogs
  // --------------------------------------------------

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/blogs");

      setBlogs(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load blogs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // --------------------------------------------------
  // Modal
  // --------------------------------------------------

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featured_image: blog.featured_image || "",
      is_published: blog.is_published ?? true,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingBlog(null);
    setForm(initialForm);
  };

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((previous) => ({
      ...previous,
      slug,
    }));
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showError("Blog title is required.");
      return;
    }

    if (!form.slug.trim()) {
      showError("Blog slug is required.");
      return;
    }

    if (!form.excerpt.trim()) {
      showError("Blog excerpt is required.");
      return;
    }

    if (!form.content.trim()) {
      showError("Blog content is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        featured_image:
          form.featured_image.trim(),
        is_published: form.is_published,
      };

      if (editingBlog) {
        await api.put(
          `/blogs/${editingBlog.id}`,
          payload
        );

        success("Blog updated successfully.");
      } else {
        await api.post(
          "/blogs",
          payload
        );

        success("Blog created successfully.");
      }

      closeModal();
      await loadBlogs();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete Confirmation
  // --------------------------------------------------

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleDelete = async () => {
    if (!blogToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/blogs/${blogToDelete.id}`
      );

      success("Blog deleted successfully.");

      setDeleteModalOpen(false);
      setBlogToDelete(null);

      await loadBlogs();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete blog."
      );
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "Not published";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not published";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* --------------------------------------------- */}
      {/* Header */}
      {/* --------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600">
                Portfolio Content
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Blogs
              </h1>
            </div>

          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Create and manage blog posts displayed on
            your public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Blog
        </button>

      </div>

      {/* --------------------------------------------- */}
      {/* Blog List */}
      {/* --------------------------------------------- */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading blogs...
              </p>

            </div>

          </div>

        ) : blogs.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No blogs found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first blog post to start building
              your portfolio blog section.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="ios-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add First Blog
            </button>

          </div>

        ) : (

          <>
            {/* --------------------------------------- */}
            {/* Desktop Table */}
            {/* --------------------------------------- */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1000px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Blog
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Slug
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Published
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {blogs.map((blog) => (

                    <tr
                      key={blog.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >

                      {/* Blog */}

                      <td className="max-w-md px-5 py-4">

                        <div className="flex items-center gap-3">

                          {blog.featured_image ? (

                            <img
                              src={blog.featured_image}
                              alt={blog.title}
                              className="h-14 w-20 shrink-0 rounded-xl border border-slate-200 object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <ImageIcon size={21} />
                            </div>

                          )}

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {blog.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {blog.excerpt}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Slug */}

                      <td className="max-w-xs px-5 py-4">

                        <span className="block truncate rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                          /{blog.slug}
                        </span>

                      </td>

                      {/* Published */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          {formatDate(
                            blog.published_at
                          )}

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        {blog.is_published ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <Eye size={13} />
                            Published
                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            <EyeOff size={13} />
                            Draft
                          </span>

                        )}

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(blog)
                            }
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                            aria-label={`Edit ${blog.title}`}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(blog)
                            }
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                            aria-label={`Delete ${blog.title}`}
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* --------------------------------------- */}
            {/* Mobile Cards */}
            {/* --------------------------------------- */}

            <div className="divide-y divide-slate-100 md:hidden">

              {blogs.map((blog) => (

                <div
                  key={blog.id}
                  className="p-4"
                >

                  <div className="flex gap-3">

                    {blog.featured_image ? (

                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="h-20 w-24 shrink-0 rounded-xl border border-slate-200 object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <ImageIcon size={22} />
                      </div>

                    )}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                          {blog.title}
                        </h3>

                        {blog.is_published ? (

                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                            Published
                          </span>

                        ) : (

                          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                            Draft
                          </span>

                        )}

                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {blog.excerpt}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="truncate rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                      /{blog.slug}
                    </p>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">

                      <CalendarDays size={14} />

                      {formatDate(
                        blog.published_at
                      )}

                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(blog)
                        }
                        className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600"
                        aria-label={`Edit ${blog.title}`}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeleteModal(blog)
                        }
                        className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

      {/* --------------------------------------------- */}
      {/* Refresh */}
      {/* --------------------------------------------- */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={loadBlogs}
          disabled={loading}
          className="ios-button inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>

      {/* --------------------------------------------- */}
      {/* Create / Edit Modal */}
      {/* --------------------------------------------- */}

      {modalOpen && (

        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">

          <div className="safe-area-bottom max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl">

            {/* Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Blogs
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">

                  {editingBlog
                    ? "Edit Blog"
                    : "Add Blog"}

                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="ios-button flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              {/* Title */}

              <div>

                <label
                  htmlFor="blog-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Blog Title
                </label>

                <input
                  id="blog-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. How I Built My Cloud Storage Platform"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* Slug */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="blog-slug"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Slug
                  </label>

                  <button
                    type="button"
                    onClick={generateSlug}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Generate from title
                  </button>

                </div>

                <div className="flex items-center">

                  <span className="flex h-[46px] items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm text-slate-500">
                    /
                  </span>

                  <input
                    id="blog-slug"
                    name="slug"
                    type="text"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="my-blog-post"
                    className="min-w-0 flex-1 rounded-r-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  The slug must be unique.
                </p>

              </div>

              {/* Excerpt */}

              <div>

                <label
                  htmlFor="blog-excerpt"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Excerpt
                </label>

                <textarea
                  id="blog-excerpt"
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short description of the blog post..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* Content */}

              <div>

                <label
                  htmlFor="blog-content"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Content
                </label>

                <textarea
                  id="blog-content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Write your complete blog content here..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* Featured Image */}

              <div>

                <label
                  htmlFor="blog-featured-image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Featured Image URL
                </label>

                <input
                  id="blog-featured-image"
                  name="featured_image"
                  type="url"
                  value={form.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/blog-image.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {form.featured_image && (

                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                    <img
                      src={form.featured_image}
                      alt="Featured image preview"
                      className="h-48 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                )}

              </div>

              {/* Published */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    Published
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Show this blog on the public portfolio.
                  </p>

                </div>

                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                  className="h-5 w-5 accent-blue-600"
                />

              </label>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="ios-button inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingBlog
                    ? "Update Blog"
                    : "Create Blog"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* --------------------------------------------- */}
      {/* Delete Confirmation Modal */}
      {/* --------------------------------------------- */}

      {deleteModalOpen && blogToDelete && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl">

            {/* Delete Icon */}

            <div className="px-6 pt-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">

                <Trash2 size={22} />

              </div>

            </div>

            {/* Content */}

            <div className="px-6 pt-4">

              <h2 className="text-lg font-bold text-slate-900">
                Delete Blog?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete
                <span className="font-semibold text-slate-700">
                  {" "}
                  "{blogToDelete.title}"
                </span>
                ? This action cannot be undone.
              </p>

            </div>

            {/* Actions */}

            <div className="flex gap-3 px-6 pb-6 pt-6">

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="ios-button flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="ios-button flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Trash2 size={17} />

                {deleting
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}