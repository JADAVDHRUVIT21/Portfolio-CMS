import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  FolderKanban,
  RefreshCw,
  Save,
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  title: "",
  description: "",
  image: "",
  technologies: "",
  live_url: "",
  github_url: "",
  display_order: 0,
  is_published: true,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    success,
    error: showError,
  } = useNotification();

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      setProjects(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: project.technologies || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      display_order:
        project.display_order ?? 0,
      is_published:
        project.is_published ?? true,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingProject(null);
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

    if (!form.title.trim()) {
      showError("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      showError(
        "Project description is required."
      );
      return;
    }

    const displayOrder = Number(
      form.display_order
    );

    if (Number.isNaN(displayOrder)) {
      showError(
        "Display order must be a valid number."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        technologies:
          form.technologies.trim(),
        live_url: form.live_url.trim(),
        github_url: form.github_url.trim(),
        display_order: displayOrder,
        is_published: form.is_published,
      };

      if (editingProject) {
        await api.put(
          `/projects/${editingProject.id}`,
          payload
        );

        success(
          "Project updated successfully."
        );
      } else {
        await api.post(
          "/projects",
          payload
        );

        success(
          "Project created successfully."
        );
      }

      closeModal();
      await loadProjects();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (project) => {
    setDeletingProject(project);
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeletingProject(null);
  };

  const confirmDelete = async () => {
    if (!deletingProject) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/projects/${deletingProject.id}`
      );

      success(
        "Project deleted successfully."
      );

      setDeletingProject(null);
      await loadProjects();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  const getTechnologies = (value) => {
    if (!value) {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FolderKanban size={21} />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600">
                Portfolio Content
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Projects
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the projects displayed on your
            public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading projects...
              </p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FolderKanban size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No projects found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first project to start building
              your portfolio project section.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="ios-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add First Project
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Technologies
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Links
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
                  {projects.map((project) => {
                    const technologies =
                      getTechnologies(
                        project.technologies
                      );

                    return (
                      <tr
                        key={project.id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="max-w-xs px-5 py-4">
                          <div className="flex items-center gap-3">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="h-12 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <FolderKanban
                                  size={20}
                                />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {project.title}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex max-w-xs flex-wrap gap-1.5">
                            {technologies.length > 0 ? (
                              technologies
                                .slice(0, 4)
                                .map(
                                  (technology) => (
                                    <span
                                      key={
                                        technology
                                      }
                                      className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                                    >
                                      {technology}
                                    </span>
                                  )
                                )
                            ) : (
                              <span className="text-xs text-slate-400">
                                No technologies
                              </span>
                            )}

                            {technologies.length >
                              4 && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                +
                                {technologies.length -
                                  4}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {project.live_url && (
                              <a
                                href={
                                  project.live_url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="ios-button flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                                aria-label="Open live project"
                              >
                                <ExternalLink
                                  size={16}
                                />
                              </a>
                            )}

                            {project.github_url && (
                              <a
                                href={
                                  project.github_url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="ios-button flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                aria-label="Open GitHub repository"
                              >
                                <span className="text-xs font-semibold">GitHub</span>
                              </a>
                            )}

                            {!project.live_url &&
                              !project.github_url && (
                                <span className="text-xs text-slate-400">
                                  No links
                                </span>
                              )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-600">
                          {project.display_order ??
                            0}
                        </td>

                        <td className="px-5 py-4">
                          {project.is_published ? (
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
                                openEditModal(
                                  project
                                )
                              }
                              className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                              aria-label={`Edit ${project.title}`}
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  project
                                )
                              }
                              className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                              aria-label={`Delete ${project.title}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {projects.map((project) => {
                const technologies =
                  getTechnologies(
                    project.technologies
                  );

                return (
                  <div
                    key={project.id}
                    className="p-4"
                  >
                    <div className="flex gap-3">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-20 w-24 shrink-0 rounded-xl border border-slate-200 object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <FolderKanban
                            size={22}
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {project.title}
                          </h3>

                          {project.is_published ? (
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
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {technologies.length > 0 ? (
                        technologies.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                            >
                              {technology}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-xs text-slate-400">
                          No technologies
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600"
                            aria-label="Open live project"
                          >
                            <ExternalLink
                              size={17}
                            />
                          </a>
                        )}

                        {project.github_url && (
                          <a
                            href={
                              project.github_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                            aria-label="Open GitHub repository"
                          >
                            <span className="text-xs font-semibold">GitHub</span>
                          </a>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              project
                            )
                          }
                          className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600"
                          aria-label={`Edit ${project.title}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              project
                            )
                          }
                          className="ios-button flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Display order:{" "}
                      <span className="font-semibold text-slate-600">
                        {project.display_order ??
                          0}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadProjects}
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

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-2xl"
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    id="delete-project-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Delete Project?
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">
                      "{deletingProject.title}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="ios-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95 disabled:opacity-50"
                  aria-label="Close delete confirmation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="ios-button min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="safe-area-bottom max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Projects
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {editingProject
                    ? "Edit Project"
                    : "Add Project"}
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
                  htmlFor="project-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Project Title
                </label>

                <input
                  id="project-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Cloud Storage Service"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="project-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the project..."
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Image */}
              <div>
                <label
                  htmlFor="project-image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Project Image URL
                </label>

                <input
                  id="project-image"
                  name="image"
                  type="text"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Enter project image URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {form.image && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={form.image}
                      alt="Project preview"
                      className="h-40 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label
                  htmlFor="project-technologies"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Technologies
                </label>

                <input
                  id="project-technologies"
                  name="technologies"
                  type="text"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, FastAPI, PostgreSQL, Tailwind CSS"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Separate technologies with commas.
                </p>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="project-live-url"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Live Project URL
                  </label>

                  <input
                    id="project-live-url"
                    name="live_url"
                    type="url"
                    value={form.live_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-github-url"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    GitHub URL
                  </label>

                  <input
                    id="project-github-url"
                    name="github_url"
                    type="url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label
                  htmlFor="project-order"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Display Order
                </label>

                <input
                  id="project-order"
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
                    Show this project on the public
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
                    : editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}