import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  company: "",
  position: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
  display_order: 1,
};

export default function Experience() {
  const { success, error: showError } = useNotification();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadExperiences = async () => {
    try {
      setLoading(true);

      const response = await api.get("/experience");

      setExperiences(response.data);
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load experience."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setEditingExperience(null);

    setForm({
      ...initialForm,
      display_order:
        experiences.length > 0
          ? Math.max(
              ...experiences.map(
                (item) => Number(item.display_order) || 0
              )
            ) + 1
          : 1,
    });

    setShowForm(true);
  };

  const openEditForm = (experience) => {
    setEditingExperience(experience);

    setForm({
      company: experience.company || "",
      position: experience.position || "",
      description: experience.description || "",
      start_date: experience.start_date || "",
      end_date: experience.end_date || "",
      is_current: Boolean(experience.is_current),
      display_order: experience.display_order ?? 1,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingExperience(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.company.trim()) {
      showError("Company name is required.");
      return;
    }

    if (!form.position.trim()) {
      showError("Position is required.");
      return;
    }

    if (!form.start_date) {
      showError("Start date is required.");
      return;
    }

    if (!form.is_current && !form.end_date) {
      showError(
        "End date is required for completed experience."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company: form.company.trim(),
        position: form.position.trim(),
        description: form.description.trim(),
        start_date: form.start_date,
        end_date: form.is_current
          ? null
          : form.end_date || null,
        is_current: Boolean(form.is_current),
        display_order: Number(form.display_order) || 1,
      };

      if (editingExperience) {
        await api.put(
          `/experience/${editingExperience.id}`,
          payload
        );

        success("Experience updated successfully.");
      } else {
        await api.post("/experience", payload);

        success("Experience added successfully.");
      }

      closeForm();
      await loadExperiences();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save experience."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (experience) => {
    setDeleteTarget(experience);
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
        `/experience/${deleteTarget.id}`
      );

      success("Experience deleted successfully.");

      setDeleteTarget(null);

      await loadExperiences();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete experience."
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Present";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Experience
              </h1>

              <p className="text-sm text-slate-500">
                Manage your professional experience and timeline.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadExperiences}
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

            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Experience List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[70px_1.2fr_1fr_1.5fr_180px_130px] items-center border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div>Order</div>
            <div>Company</div>
            <div>Position</div>
            <div>Description</div>
            <div>Duration</div>
            <div className="text-right">Actions</div>
          </div>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : experiences.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <BriefcaseBusiness size={26} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No experience added
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Add your first professional experience to
                display it on your portfolio.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="grid grid-cols-[70px_1.2fr_1fr_1.5fr_180px_130px] items-center px-5 py-4"
                >
                  <div>
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-600">
                      {experience.display_order}
                    </span>
                  </div>

                  <div className="min-w-0 pr-4">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {experience.company}
                    </p>
                  </div>

                  <div className="min-w-0 pr-4">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {experience.position}
                    </p>
                  </div>

                  <div className="min-w-0 pr-4">
                    <p className="line-clamp-2 text-sm text-slate-500">
                      {experience.description ||
                        "No description"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <CalendarDays size={14} />

                      <span>
                        {formatDate(
                          experience.start_date
                        )}{" "}
                        –{" "}
                        {experience.is_current
                          ? "Present"
                          : formatDate(
                              experience.end_date
                            )}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      {experience.is_current ? (
                        <>
                          <Eye
                            size={13}
                            className="text-emerald-600"
                          />

                          <span className="text-xs font-medium text-emerald-600">
                            Current
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff
                            size={13}
                            className="text-slate-400"
                          />

                          <span className="text-xs text-slate-400">
                            Completed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(experience)
                      }
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg border border-slate-200
                        text-slate-600 transition
                        hover:bg-slate-50 hover:text-blue-600
                      "
                      aria-label="Edit experience"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        confirmDelete(experience)
                      }
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg border border-red-100
                        text-red-500 transition
                        hover:bg-red-50
                      "
                      aria-label="Delete experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : experiences.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <BriefcaseBusiness size={26} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No experience added
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first experience.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add Experience
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-[11px] font-bold text-slate-600">
                          {experience.display_order}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            experience.is_current
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {experience.is_current
                            ? "Current"
                            : "Completed"}
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-base font-bold text-slate-900">
                        {experience.position}
                      </h3>

                      <p className="mt-0.5 text-sm font-medium text-blue-600">
                        {experience.company}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(experience)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
                        aria-label="Edit experience"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete(experience)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500"
                        aria-label="Delete experience"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />

                    <span>
                      {formatDate(experience.start_date)}{" "}
                      –{" "}
                      {experience.is_current
                        ? "Present"
                        : formatDate(
                            experience.end_date
                          )}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {experience.description ||
                      "No description"}
                  </p>
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
                  {editingExperience
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add professional timeline information.
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
              {/* Company */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
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

              {/* Position */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
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

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your responsibilities, achievements, and work..."
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

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="
                      h-11 w-full rounded-xl border border-slate-200
                      bg-slate-50 px-4 text-sm text-slate-900
                      outline-none transition
                      focus:border-blue-500 focus:bg-white
                      focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    disabled={form.is_current}
                    className="
                      h-11 w-full rounded-xl border border-slate-200
                      bg-slate-50 px-4 text-sm text-slate-900
                      outline-none transition
                      disabled:cursor-not-allowed disabled:opacity-50
                      focus:border-blue-500 focus:bg-white
                      focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>
              </div>

              {/* Current */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="is_current"
                  checked={form.is_current}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Currently working here
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Leave the end date empty and show this
                    experience as current.
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
                    : editingExperience
                      ? "Update Experience"
                      : "Save Experience"}
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
              Delete experience?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.position}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-700">
                {deleteTarget.company}
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
                  : "Delete Experience"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}