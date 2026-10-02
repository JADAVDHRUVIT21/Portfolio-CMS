import { useEffect, useState } from "react";
import {
  Code2,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  name: "",
  category: "",
  icon: "", // <-- ADDED: Icon URL or Lucide name
  proficiency: 0,
  display_order: 0,
  is_published: true,
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const {
    success,
    error: showError,
  } = useNotification();

  const loadSkills = async () => {
    try {
      setLoading(true);

      const response = await api.get("/skills");

      setSkills(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      icon: skill.icon || "", // <-- ADDED
      proficiency: skill.proficiency ?? 0,
      display_order: skill.display_order ?? 0,
      is_published:
        skill.is_published ?? true,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingSkill(null);
    setForm(initialForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showError("Skill name is required.");
      return;
    }

    const proficiency = Number(
      form.proficiency
    );

    const displayOrder = Number(
      form.display_order
    );

    if (
      Number.isNaN(proficiency) ||
      proficiency < 0 ||
      proficiency > 100
    ) {
      showError(
        "Proficiency must be between 0 and 100."
      );
      return;
    }

    if (Number.isNaN(displayOrder)) {
      showError(
        "Display order must be a valid number."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        icon: form.icon.trim(), // <-- ADDED
        proficiency,
        display_order: displayOrder,
        is_published: form.is_published,
      };

      if (editingSkill) {
        await api.put(
          `/skills/${editingSkill.id}`,
          payload
        );

        success(
          "Skill updated successfully."
        );
      } else {
        await api.post("/skills", payload);

        success(
          "Skill created successfully."
        );
      }

      closeModal();
      await loadSkills();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/skills/${skill.id}`
      );

      success(
        "Skill deleted successfully."
      );

      await loadSkills();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete skill."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Code2 size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600">
                Portfolio Content
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Skills
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the technical and professional
            skills displayed on your public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {/* Skills List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading skills...
              </p>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Code2 size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No skills found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first skill to start building
              your portfolio skills section.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="ios-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add First Skill
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Skill
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Proficiency
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
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
                  {skills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* ICON PREVIEW */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            {skill.icon ? (
                              // If it's a URL, show image. If it's a Lucide name, we just show a generic icon or attempt render
                              skill.icon.startsWith("http") || skill.icon.startsWith("data:") ? (
                                <img
                                  src={skill.icon}
                                  alt={skill.name}
                                  className="h-full w-full object-contain p-1"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>';
                                  }}
                                />
                              ) : (
                                <Code2 size={16} className="text-slate-500" />
                              )
                            ) : (
                              <Code2 size={16} className="text-slate-400" />
                            )}
                          </div>
                          <p className="font-semibold text-slate-900">
                            {skill.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {skill.category || "General"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    Number(
                                      skill.proficiency || 0
                                    ),
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-sm font-semibold text-slate-700">
                            {skill.proficiency ?? 0}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-600">
                        {skill.display_order ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        {skill.is_published ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(skill)
                            }
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                            aria-label={`Edit ${skill.name}`}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(skill)
                            }
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                            aria-label={`Delete ${skill.name}`}
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

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                         {/* Mobile Icon */}
                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 overflow-hidden border border-slate-200">
                            {skill.icon && (skill.icon.startsWith("http") || skill.icon.startsWith("data:")) ? (
                                <img src={skill.icon} alt={skill.name} className="h-full w-full object-contain p-0.5" />
                            ) : (
                                <Code2 size={14} className="text-slate-500" />
                            )}
                         </div>
                         <h3 className="truncate text-base font-bold text-slate-900">
                            {skill.name}
                         </h3>
                      </div>

                      <p className="mt-1 text-xs text-slate-500 ml-10">
                        {skill.category || "General"}
                      </p>
                    </div>

                    {skill.is_published ? (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Proficiency
                      </span>

                      <span className="text-sm font-bold text-slate-700">
                        {skill.proficiency ?? 0}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                skill.proficiency || 0
                              ),
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Display order:{" "}
                      <span className="font-semibold text-slate-700">
                        {skill.display_order ?? 0}
                      </span>
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(skill)
                        }
                        className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(skill)
                        }
                        className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label={`Delete ${skill.name}`}
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

      {/* Reload */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadSkills}
          disabled={loading}
          className="ios-button inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="safe-area-bottom max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Skills
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {editingSkill
                    ? "Edit Skill"
                    : "Add Skill"}
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

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="skill-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Skill Name
                </label>

                <input
                  id="skill-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="skill-category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <input
                  id="skill-category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Frontend"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* ICON INPUT (NEW) */}
              <div>
                <label
                  htmlFor="skill-icon"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Icon (URL or Name)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ImageIcon size={18} />
                  </div>
                  <input
                    id="skill-icon"
                    name="icon"
                    type="text"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="e.g. https://example.com/icon.png or Code2"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Paste an Image URL or a Lucide icon name (e.g. Code2, Database).
                </p>
              </div>

              {/* Proficiency */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="skill-proficiency"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Proficiency
                  </label>

                  <span className="text-sm font-bold text-blue-600">
                    {form.proficiency || 0}%
                  </span>
                </div>

                <input
                  id="skill-proficiency"
                  name="proficiency"
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={handleChange}
                  className="w-full accent-blue-600"
                />

                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label
                  htmlFor="skill-order"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Display Order
                </label>

                <input
                  id="skill-order"
                  name="display_order"
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Published */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Published
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Show this skill on the public
                    portfolio.
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
                    : editingSkill
                    ? "Update Skill"
                    : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}