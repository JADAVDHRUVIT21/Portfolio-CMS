import { useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";
import { useNotification } from "../context/NotificationContext";

export default function Messages() {
  const { showNotification } = useNotification();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/messages");

      setMessages(response.data);
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail || "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

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

  const openMessage = async (message) => {
    setSelectedMessage(message);

    if (message.is_read) {
      return;
    }

    try {
      setMarkingRead(true);

      const response = await api.patch(
        `/messages/${message.id}/read`
      );

      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id ? response.data : item
        )
      );

      setSelectedMessage(response.data);
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail ||
          "Failed to mark message as read."
      );
    } finally {
      setMarkingRead(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteMessage) return;

    try {
      setDeleting(true);

      await api.delete(`/messages/${deleteMessage.id}`);

      setMessages((previous) =>
        previous.filter(
          (item) => item.id !== deleteMessage.id
        )
      );

      if (selectedMessage?.id === deleteMessage.id) {
        setSelectedMessage(null);
      }

      setDeleteMessage(null);

      showNotification(
        "success",
        "Message deleted successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        error.response?.data?.detail ||
          "Failed to delete message."
      );
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Messages
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage messages received from your portfolio.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          <Mail size={16} />

          {unreadCount} unread
        </div>
      </div>

      {/* Messages */}
      <div className="ios-card overflow-hidden">
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Mail size={28} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No messages
            </h2>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Messages submitted through your portfolio contact form
              will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sender
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Received
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={`transition hover:bg-slate-50/60 ${
                        !message.is_read
                          ? "bg-blue-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              message.is_read
                                ? "bg-slate-100 text-slate-500"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {message.is_read ? (
                              <MailOpen size={18} />
                            ) : (
                              <Mail size={18} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`truncate text-sm ${
                                message.is_read
                                  ? "font-medium text-slate-700"
                                  : "font-bold text-slate-900"
                              }`}
                            >
                              {message.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {message.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className={`max-w-[260px] truncate text-sm ${
                            message.is_read
                              ? "font-medium text-slate-700"
                              : "font-bold text-slate-900"
                          }`}
                        >
                          {message.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {message.is_read ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            <MailOpen size={13} />
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <Mail size={13} />
                            Unread
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(message.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openMessage(message)}
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-lg text-slate-500
                              transition hover:bg-blue-50 hover:text-blue-600
                            "
                            title="View message"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteMessage(message)
                            }
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-lg text-slate-500
                              transition hover:bg-red-50 hover:text-red-600
                            "
                            title="Delete message"
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 ${
                    !message.is_read
                      ? "bg-blue-50/30"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        message.is_read
                          ? "bg-slate-100 text-slate-500"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {message.is_read ? (
                        <MailOpen size={18} />
                      ) : (
                        <Mail size={18} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className={`truncate text-sm ${
                              message.is_read
                                ? "font-medium text-slate-700"
                                : "font-bold text-slate-900"
                            }`}
                          >
                            {message.name}
                          </h3>

                          <p className="truncate text-xs text-slate-500">
                            {message.email}
                          </p>
                        </div>

                        {message.is_read ? (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            Read
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                            New
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-2 truncate text-sm ${
                          message.is_read
                            ? "text-slate-600"
                            : "font-semibold text-slate-900"
                        }`}
                      >
                        {message.subject}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(message.created_at)}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openMessage(message)}
                          className="
                            flex flex-1 items-center justify-center gap-2
                            rounded-xl border border-slate-200
                            px-3 py-2.5 text-sm font-medium text-slate-700
                            transition hover:bg-slate-50
                          "
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteMessage(message)
                          }
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div
          className="
            fixed inset-0 z-50 flex items-end justify-center
            bg-slate-900/40 p-0 backdrop-blur-sm
            sm:items-center sm:p-4
          "
        >
          <div
            className="
              max-h-[90vh] w-full overflow-y-auto
              rounded-t-3xl bg-white shadow-2xl
              sm:max-w-2xl sm:rounded-3xl
            "
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Message Details
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Received {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
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

            {/* Details */}
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Name
                  </p>

                  <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">
                    {selectedMessage.name}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1.5 break-all text-sm font-semibold text-slate-900">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Subject
                </p>

                <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Message
                  </p>

                  {selectedMessage.is_read && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 size={14} />
                      Read
                    </span>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {markingRead && (
                <p className="text-center text-xs text-slate-400">
                  Marking message as read...
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="
                    rounded-xl border border-slate-200
                    px-5 py-2.5 text-sm font-semibold text-slate-700
                    transition hover:bg-slate-50
                  "
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteMessage(selectedMessage);
                    setSelectedMessage(null);
                  }}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl bg-red-600 px-5 py-2.5
                    text-sm font-semibold text-white
                    transition hover:bg-red-700
                  "
                >
                  <Trash2 size={16} />
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteMessage && (
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
              Delete message?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete the message from{" "}
              <span className="font-semibold text-slate-700">
                {deleteMessage.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteMessage(null)}
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