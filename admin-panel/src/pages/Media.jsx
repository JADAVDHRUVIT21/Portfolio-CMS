import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  FileImage,
  Trash2,
  X,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

export default function Media() {
  const { showNotification } = useNotification();

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [deleteMedia, setDeleteMedia] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);

      const response = await api.get("/media");

      setMedia(response.data);
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to load media."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleDelete = async () => {
    if (!deleteMedia) return;

    try {
      setDeleting(true);

      await api.delete(`/media/${deleteMedia.id}`);

      setMedia((previous) =>
        previous.filter((item) => item.id !== deleteMedia.id)
      );

      if (selectedMedia?.id === deleteMedia.id) {
        setSelectedMedia(null);
      }

      setDeleteMedia(null);

      showNotification(
        "success",
        "Media deleted successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to delete media."
      );
    } finally {
      setDeleting(false);
    }
  };

  const getMediaUrl = (item) => {
    return (
      item.url ||
      item.file_url ||
      item.path ||
      item.file_path ||
      ""
    );
  };

  const getMediaName = (item) => {
    return (
      item.filename ||
      item.file_name ||
      item.name ||
      `Media #${item.id}`
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isImage = (item) => {
    const type = item.mime_type || item.content_type || "";
    const url = getMediaUrl(item);

    if (type.startsWith("image/")) {
      return true;
    }

    return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Media
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage uploaded portfolio media.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMedia}
          disabled={loading}
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl border border-slate-200
            bg-white px-4 py-2.5
            text-sm font-semibold text-slate-700
            shadow-sm transition
            hover:bg-slate-50
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Media Library */}
      <div className="ios-card overflow-hidden">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading media...
            </p>
          </div>
        ) : media.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ImageIcon size={30} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No media yet
            </h2>

            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Uploaded images and files will appear here.
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {media.map((item) => {
                const mediaUrl = getMediaUrl(item);
                const mediaName = getMediaName(item);
                const image = isImage(item);

                return (
                  <div
                    key={item.id}
                    className="
                      group overflow-hidden rounded-2xl
                      border border-slate-200 bg-white
                      transition hover:-translate-y-0.5
                      hover:shadow-lg
                    "
                  >
                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => setSelectedMedia(item)}
                      className="
                        relative block aspect-square w-full
                        overflow-hidden bg-slate-100
                        text-left
                      "
                    >
                      {image && mediaUrl ? (
                        <img
                          src={mediaUrl}
                          alt={mediaName}
                          className="
                            h-full w-full object-cover
                            transition duration-300
                            group-hover:scale-105
                          "
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                          <FileImage size={38} />

                          <span className="mt-2 px-3 text-center text-xs">
                            File
                          </span>
                        </div>
                      )}

                      <div
                        className="
                          absolute inset-0 flex items-center
                          justify-center bg-slate-900/0
                          opacity-0 transition
                          group-hover:bg-slate-900/30
                          group-hover:opacity-100
                        "
                      >
                        <div className="rounded-full bg-white/95 p-2.5 text-slate-700 shadow-lg">
                          <ExternalLink size={18} />
                        </div>
                      </div>
                    </button>

                    {/* Information */}
                    <div className="p-3">
                      <p
                        className="
                          truncate text-sm font-semibold
                          text-slate-800
                        "
                        title={mediaName}
                      >
                        {mediaName}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(item.created_at)}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMedia(item)}
                          className="
                            flex flex-1 items-center
                            justify-center gap-1.5
                            rounded-lg bg-slate-100
                            px-2 py-2
                            text-xs font-semibold
                            text-slate-700
                            transition hover:bg-slate-200
                          "
                        >
                          <ExternalLink size={14} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteMedia(item)}
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-red-50 text-red-600
                            transition hover:bg-red-100
                          "
                          title="Delete media"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Media Details Modal */}
      {selectedMedia && (
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
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  Media Details
                </h2>

                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {getMediaName(selectedMedia)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="
                  flex h-9 w-9 shrink-0 items-center
                  justify-center rounded-full
                  text-slate-400
                  transition hover:bg-slate-100
                  hover:text-slate-700
                "
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Preview */}
              <div className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {isImage(selectedMedia) &&
                getMediaUrl(selectedMedia) ? (
                  <img
                    src={getMediaUrl(selectedMedia)}
                    alt={getMediaName(selectedMedia)}
                    className="
                      max-h-[420px] max-w-full
                      object-contain
                    "
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <FileImage size={50} />

                    <p className="mt-3 text-sm">
                      Preview unavailable
                    </p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    File Name
                  </p>

                  <p className="mt-1.5 break-all text-sm font-semibold text-slate-900">
                    {getMediaName(selectedMedia)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Media ID
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-slate-900">
                    #{selectedMedia.id}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Type
                  </p>

                  <p className="mt-1.5 break-all text-sm font-semibold text-slate-900">
                    {selectedMedia.mime_type ||
                      selectedMedia.content_type ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Uploaded
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-slate-900">
                    {formatDate(selectedMedia.created_at)}
                  </p>
                </div>
              </div>

              {/* URL */}
              {getMediaUrl(selectedMedia) && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    URL
                  </p>

                  <a
                    href={getMediaUrl(selectedMedia)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      mt-1.5 block break-all text-sm
                      font-medium text-blue-600
                      hover:underline
                    "
                  >
                    {getMediaUrl(selectedMedia)}
                  </a>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMedia(null)}
                  className="
                    rounded-xl border border-slate-200
                    px-5 py-2.5 text-sm font-semibold
                    text-slate-700
                    transition hover:bg-slate-50
                  "
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteMedia(selectedMedia);
                    setSelectedMedia(null);
                  }}
                  className="
                    inline-flex items-center
                    justify-center gap-2
                    rounded-xl bg-red-600
                    px-5 py-2.5 text-sm font-semibold
                    text-white transition hover:bg-red-700
                  "
                >
                  <Trash2 size={16} />
                  Delete Media
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteMedia && (
        <div
          className="
            fixed inset-0 z-[60] flex items-center
            justify-center bg-slate-900/40 p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full max-w-md rounded-3xl
              bg-white p-6 shadow-2xl
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Delete media?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {getMediaName(deleteMedia)}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteMedia(null)}
                disabled={deleting}
                className="
                  rounded-xl border border-slate-200
                  px-5 py-2.5 text-sm font-semibold
                  text-slate-700
                  transition hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="
                  rounded-xl bg-red-600
                  px-5 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
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