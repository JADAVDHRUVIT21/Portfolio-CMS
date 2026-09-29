import { useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

const initialForm = {
  title: "",
  description: "",
  profile_image: "",
};

export default function About() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    success,
    error: showError,
  } = useNotification();

  const loadAbout = async () => {
    try {
      setLoading(true);

      const response = await api.get("/about");

      if (response.data) {
        setForm({
          title: response.data.title || "",
          description:
            response.data.description || "",
          profile_image:
            response.data.profile_image || "",
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setForm(initialForm);
      } else {
        showError(
          err.response?.data?.detail ||
            "Unable to load About information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await api.put("/about", {
        title: form.title,
        description: form.description,
        profile_image: form.profile_image,
      });

      success("About information updated successfully.");

      await loadAbout();
    } catch (err) {
      showError(
        err.response?.data?.detail ||
          "Unable to update About information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading About information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserRound size={21} />
          </div>

          <div>
            <p className="text-sm font-medium text-blue-600">
              Portfolio Content
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              About
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Manage the introduction and profile information
          displayed on your public portfolio.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. About Me"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              placeholder="Write your About information..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label
              htmlFor="profile_image"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Profile Image URL
            </label>

            <input
              id="profile_image"
              name="profile_image"
              type="text"
              value={form.profile_image}
              onChange={handleChange}
              placeholder="Enter profile image URL"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            {form.profile_image && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">
                  Image preview
                </p>

                <div className="h-32 w-32 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={form.profile_image}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={loadAbout}
              disabled={saving}
              className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} />
              Reload
            </button>

            <button
              type="submit"
              disabled={saving}
              className="ios-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}