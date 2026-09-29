import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  MessageSquareQuote,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  name: "",
  role: "",
  company: "",
  message: "",
  profile_image: "",
  rating: 5,
  is_published: true,
  display_order: 1,
};

export default function Testimonials() {
  const { success, error: showError } = useNotification();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState(null);

  const [form, setForm] = useState(initialForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTestimonials = async () => {
    try {
      setLoading(true);

      const response = await api.get("/testimonials");

      setTestimonials(response.data);
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setEditingTestimonial(null);

    setForm({
      ...initialForm,
      display_order:
        testimonials.length > 0
          ? Math.max(
              ...testimonials.map(
                (item) => Number(item.display_order) || 0
              )
            ) + 1
          : 1,
    });

    setShowForm(true);
  };

  const openEditForm = (testimonial) => {
    setEditingTestimonial(testimonial);

    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      message: testimonial.message || "",
      profile_image: testimonial.profile_image || "",
      rating: testimonial.rating ?? 5,
      is_published: Boolean(testimonial.is_published),
      display_order: testimonial.display_order ?? 1,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingTestimonial(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showError("Name is required.");
      return;
    }

    if (!form.message.trim()) {
      showError("Testimonial message is required.");
      return;
    }

    const rating = Number(form.rating);

    if (rating < 1 || rating > 5) {
      showError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        profile_image: form.profile_image.trim() || null,
        rating,
        is_published: Boolean(form.is_published),
        display_order: Number(form.display_order) || 1,
      };

      if (editingTestimonial) {
        await api.put(
          `/testimonials/${editingTestimonial.id}`,
          payload
        );

        success("Testimonial updated successfully.");
      } else {
        await api.post("/testimonials", payload);

        success("Testimonial added successfully.");
      }

      closeForm();
      await loadTestimonials();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save testimonial."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (testimonial) => {
    setDeleteTarget(testimonial);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await api.delete(
        `/testimonials/${deleteTarget.id}`
      );

      success("Testimonial deleted successfully.");

      setDeleteTarget(null);

      await loadTestimonials();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete testimonial."
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Star
            key={starNumber}
            size={14}
            className={
              starNumber <= value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquareQuote size={20} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Testimonials
              </h1>

              <p className="text-sm text-slate-500">
                Manage client and user testimonials.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadTestimonials}
            disabled={loading}
            className="
              flex h-11 items-center justify-center gap-2
              rounded-xl border border-slate-200
              bg-white px-4 text-sm font-semibold text-slate-700
              shadow-sm transition
              hover:bg-slate-50
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="
              flex h-11 items-center justify-center gap-2
              rounded-xl bg-blue-600 px-4
              text-sm font-semibold text-white
              shadow-sm transition
              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            <Plus size={18} />

            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[70px_1.2fr_1fr_1.8fr_130px_130px] items-center border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div>Order</div>
            <div>Person</div>
            <div>Company</div>
            <div>Message</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <MessageSquareQuote size={26} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No testimonials added
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Add your first testimonial to display it on
                your portfolio.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Testimonial
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="grid grid-cols-[70px_1.2fr_1fr_1.8fr_130px_130px] items-center px-5 py-4"
                >
                  {/* Order */}
                  <div>
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-600">
                      {testimonial.display_order}
                    </span>
                  </div>

                  {/* Person */}
                  <div className="flex min-w-0 items-center gap-3 pr-4">
                    {testimonial.profile_image ? (
                      <img
                        src={testimonial.profile_image}
                        alt={testimonial.name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                        {testimonial.name
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {testimonial.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {testimonial.role || "No role"}
                      </p>

                      <div className="mt-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="min-w-0 pr-4">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {testimonial.company || "—"}
                    </p>
                  </div>

                  {/* Message */}
                  <div className="min-w-0 pr-4">
                    <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                      {testimonial.message}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    {testimonial.is_published ? (
                      <div className="flex items-center gap-1.5">
                        <Eye
                          size={14}
                          className="text-emerald-600"
                        />

                        <span className="text-xs font-semibold text-emerald-600">
                          Published
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <EyeOff
                          size={14}
                          className="text-slate-400"
                        />

                        <span className="text-xs font-semibold text-slate-400">
                          Draft
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(testimonial)
                      }
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg border border-slate-200
                        text-slate-600 transition
                        hover:bg-slate-50 hover:text-blue-600
                      "
                      aria-label="Edit testimonial"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        confirmDelete(testimonial)
                      }
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg border border-red-100
                        text-red-500 transition
                        hover:bg-red-50
                      "
                      aria-label="Delete testimonial"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <MessageSquareQuote size={26} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No testimonials added
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first testimonial.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add Testimonial
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {testimonial.profile_image ? (
                        <img
                          src={testimonial.profile_image}
                          alt={testimonial.name}
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {testimonial.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {testimonial.name}
                        </h3>

                        <p className="truncate text-xs text-blue-600">
                          {testimonial.role || "No role"}
                        </p>

                        {testimonial.company && (
                          <p className="truncate text-xs text-slate-400">
                            {testimonial.company}
                          </p>
                        )}

                        <div className="mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(testimonial)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
                        aria-label="Edit testimonial"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete(testimonial)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500"
                        aria-label="Delete testimonial"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-sm leading-6 text-slate-600">
                      “{testimonial.message}”
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                      Order {testimonial.display_order}
                    </span>

                    {testimonial.is_published ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <Eye size={13} />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                        <EyeOff size={13} />
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/60 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingTestimonial
                    ? "Edit Testimonial"
                    : "Add Testimonial"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add client feedback to your portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="
                    h-11 w-full rounded-xl border border-slate-200
                    bg-slate-50 px-4 text-sm text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:bg-white
                    focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>

              {/* Role + Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. CEO"
                    className="
                      h-11 w-full rounded-xl border border-slate-200
                      bg-slate-50 px-4 text-sm text-slate-900
                      outline-none transition
                      placeholder:text-slate-400
                      focus:border-blue-500 focus:bg-white
                      focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Inc."
                    className="
                      h-11 w-full rounded-xl border border-slate-200
                      bg-slate-50 px-4 text-sm text-slate-900
                      outline-none transition
                      placeholder:text-slate-400
                      focus:border-blue-500 focus:bg-white
                      focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Testimonial Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write the client's testimonial..."
                  className="
                    w-full resize-none rounded-xl border border-slate-200
                    bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:bg-white
                    focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <input
                    type="url"
                    name="profile_image"
                    value={form.profile_image}
                    onChange={handleChange}
                    placeholder="https://example.com/profile.jpg"
                    className="
                      h-11 w-full rounded-xl border border-slate-200
                      bg-slate-50 pl-10 pr-4 text-sm text-slate-900
                      outline-none transition
                      placeholder:text-slate-400
                      focus:border-blue-500 focus:bg-white
                      focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>

                {form.profile_image && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={form.profile_image}
                      alt="Preview"
                      className="h-12 w-12 rounded-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <span className="text-xs text-slate-400">
                      Image preview
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Rating
                </label>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <button
                      key={starNumber}
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          rating: starNumber,
                        }))
                      }
                      className="rounded-md p-1 transition hover:bg-amber-50"
                      aria-label={`Set rating to ${starNumber}`}
                    >
                      <Star
                        size={25}
                        className={
                          starNumber <= Number(form.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  ))}

                  <span className="ml-2 text-sm font-semibold text-slate-600">
                    {form.rating}/5
                  </span>
                </div>
              </div>

              {/* Published */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Publish testimonial
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Published testimonials can appear on the
                    public portfolio.
                  </p>
                </div>
              </label>

              {/* Display Order */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  min="1"
                  value={form.display_order}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-xl border border-slate-200
                    bg-slate-50 px-4 text-sm text-slate-900
                    outline-none transition
                    focus:border-blue-500 focus:bg-white
                    focus:ring-4 focus:ring-blue-500/10
                  "
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    h-11 rounded-xl border border-slate-200
                    bg-white px-5 text-sm font-semibold text-slate-700
                    transition hover:bg-slate-50
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex h-11 items-center justify-center gap-2
                    rounded-xl bg-blue-600 px-5
                    text-sm font-semibold text-white
                    transition hover:bg-blue-700
                    active:scale-[0.98]
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {saving ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingTestimonial
                      ? "Update Testimonial"
                      : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete testimonial?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete the testimonial
              from{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={deleting}
                className="
                  h-11 rounded-xl border border-slate-200
                  bg-white px-5 text-sm font-semibold text-slate-700
                  hover:bg-slate-50 disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="
                  flex h-11 items-center justify-center gap-2
                  rounded-xl bg-red-500 px-5
                  text-sm font-semibold text-white
                  hover:bg-red-600
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {deleting && (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}