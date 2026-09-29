import { useEffect, useState } from "react";
import {
  Edit3,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Circle,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

export default function Services() {
  const { showNotification } = useNotification();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "",
    display_order: 1,
    is_published: true,
  });

  const [saving, setSaving] = useState(false);

  const [deleteService, setDeleteService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/services");

      setServices(response.data);
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      icon: "",
      display_order: 1,
      is_published: true,
    });

    setEditingService(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);

    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      display_order: service.display_order ?? 1,
      is_published: service.is_published ?? true,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showNotification("warning", "Please enter a service title.");
      return;
    }

    if (!form.description.trim()) {
      showNotification("warning", "Please enter a service description.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon.trim() || null,
        display_order: Number(form.display_order),
        is_published: form.is_published,
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, payload);

        showNotification(
          "success",
          "Service updated successfully."
        );
      } else {
        await api.post("/services", payload);

        showNotification(
          "success",
          "Service created successfully."
        );
      }

      setShowForm(false);
      resetForm();

      await loadServices();
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteService) return;

    try {
      setDeleting(true);

      await api.delete(`/services/${deleteService.id}`);

      showNotification(
        "success",
        "Service deleted successfully."
      );

      setDeleteService(null);

      await loadServices();
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Services
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the services displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="
            ios-button
            inline-flex items-center justify-center gap-2
            rounded-xl bg-blue-600 px-4 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Services */}
      <div className="ios-card overflow-hidden">
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading services...
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Plus size={25} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No services yet
            </h2>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Add your first service to display it on your portfolio.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="
                mt-4 inline-flex items-center gap-2
                rounded-xl bg-blue-600 px-4 py-2.5
                text-sm font-semibold text-white
                transition hover:bg-blue-700
                active:scale-[0.98]
              "
            >
              <Plus size={17} />
              Add Service
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Icon
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

                <tbody className="divide-y divide-slate-100">
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold text-slate-900">
                            {service.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {service.description}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {service.icon ? (
                          <span className="inline-flex max-w-[180px] rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {service.icon}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {service.display_order}
                      </td>

                      <td className="px-5 py-4">
                        {service.is_published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={14} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <Circle size={14} />
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(service)}
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-lg text-slate-500
                              transition hover:bg-blue-50 hover:text-blue-600
                            "
                            title="Edit service"
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteService(service)}
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-lg text-slate-500
                              transition hover:bg-red-50 hover:text-red-600
                            "
                            title="Delete service"
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

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {service.description}
                      </p>
                    </div>

                    {service.is_published ? (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {service.icon && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {service.icon}
                      </span>
                    )}

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      Order: {service.display_order}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(service)}
                      className="
                        flex flex-1 items-center justify-center gap-2
                        rounded-xl border border-slate-200
                        px-3 py-2.5 text-sm font-medium text-slate-700
                        transition hover:bg-slate-50
                      "
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteService(service)}
                      className="
                        flex flex-1 items-center justify-center gap-2
                        rounded-xl border border-red-100
                        px-3 py-2.5 text-sm font-medium text-red-600
                        transition hover:bg-red-50
                      "
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div
          className="
            fixed inset-0 z-50 flex items-end justify-center
            bg-slate-900/40 p-0 backdrop-blur-sm
            sm:items-center sm:p-4
          "
        >
          <div
            className="
              max-h-[92vh] w-full overflow-y-auto
              rounded-t-3xl bg-white shadow-2xl
              sm:max-w-2xl sm:rounded-3xl
            "
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {editingService
                    ? "Update service information."
                    : "Add a new service to your portfolio."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full text-slate-400
                  transition hover:bg-slate-100 hover:text-slate-700
                "
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-white px-4 py-3 text-sm text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the service..."
                  className="
                    w-full resize-none rounded-xl border border-slate-200
                    bg-white px-4 py-3 text-sm text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Icon
                </label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="e.g. Code2, Globe, Smartphone"
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-white px-4 py-3 text-sm text-slate-900
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Enter the icon name or value you want to use on the portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    min="0"
                    value={form.display_order}
                    onChange={handleChange}
                    className="
                      w-full rounded-xl border border-slate-200
                      bg-white px-4 py-3 text-sm text-slate-900
                      outline-none transition
                      focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                    "
                  />
                </div>

                <div className="flex items-end">
                  <label
                    className="
                      flex w-full cursor-pointer items-center gap-3
                      rounded-xl border border-slate-200
                      px-4 py-3
                    "
                  >
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-700">
                        Published
                      </span>

                      <span className="block text-xs text-slate-400">
                        Show this service publicly
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    rounded-xl border border-slate-200
                    px-5 py-3 text-sm font-semibold text-slate-700
                    transition hover:bg-slate-50
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    rounded-xl bg-blue-600 px-5 py-3
                    text-sm font-semibold text-white
                    shadow-sm transition hover:bg-blue-700
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingService
                      ? "Update Service"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteService && (
        <div
          className="
            fixed inset-0 z-[60] flex items-center justify-center
            bg-slate-900/40 p-4 backdrop-blur-sm
          "
        >
          <div
            className="
              w-full max-w-md rounded-3xl bg-white
              p-6 shadow-2xl
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deleteService.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteService(null)}
                disabled={deleting}
                className="
                  rounded-xl border border-slate-200
                  px-5 py-2.5 text-sm font-semibold text-slate-700
                  transition hover:bg-slate-50
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="
                  rounded-xl bg-red-600 px-5 py-2.5
                  text-sm font-semibold text-white
                  transition hover:bg-red-700
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}