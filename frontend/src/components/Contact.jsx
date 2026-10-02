import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { Reveal } from "./Hero";
import api from "../services/api"; // ✅ use your existing API service

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      // ✅ POST to YOUR backend — backend saves to DB + sends email
      const response = await api.post("/contact", {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      // ✅ Success
      setForm({ name: "", email: "", subject: "", message: "" });
      setStatus({
        type: "success",
        message: "Your message has been sent successfully.",
      });
      setToast({
        type: "success",
        message: "Mail sent successfully!",
      });
    } catch (err) {
      console.error("Failed to send contact message:", err);
      const errorMsg =
        err.response?.data?.detail ||
        "Unable to send your message right now.";

      setStatus({ type: "error", message: errorMsg });
      setToast({ type: "error", message: "Failed to send mail. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ---------- iOS-style Toast ---------- */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 top-6 z-[200] -translate-x-1/2 w-[calc(100%-2rem)] max-w-md animate-[toastIn_320ms_cubic-bezier(0.22,1,0.36,1)]"
        >
          <div
            className={[
              "flex items-center gap-3 rounded-2xl border px-4 py-3.5",
              "backdrop-blur-xl shadow-2xl",
              toast.type === "success"
                ? "border-emerald-400/30 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/80 dark:text-emerald-200"
                : "border-red-400/30 bg-red-50/90 text-red-800 dark:border-red-500/30 dark:bg-red-950/80 dark:text-red-200",
            ].join(" ")}
          >
            <span
              className={[
                "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                toast.type === "success"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400",
              ].join(" ")}
            >
              {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </span>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="mt-0.5 text-xs opacity-90">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full opacity-60 transition hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- Contact Section ---------- */}
      <section
        id="contact"
        className="scroll-mt-24 px-6 py-24 sm:px-8 lg:py-32 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            {/* Left side — info */}
            <div>
              <Reveal delay={0} y={20}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                  Contact
                </p>
              </Reveal>

              <Reveal delay={120} y={28}>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Let&apos;s build something useful.
                </h2>
              </Reveal>

              <Reveal delay={240} y={24}>
                <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                  Have a project, idea, or opportunity in mind? Send me a message
                  and I&apos;ll get back to you.
                </p>
              </Reveal>

              <Reveal delay={360} y={20}>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 hover:rotate-3 hover:bg-blue-500 hover:text-white hover:shadow-[0_8px_20px_rgba(37,99,235,0.45)]">
                    <Mail size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Get in touch</p>
                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      dhruvit715@gmail.com
                    </p>
                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      Send a Mail using the form
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={180} y={34}>
              <form
                onSubmit={handleSubmit}
                className="group relative overflow-hidden rounded-3xl border p-6 shadow-xl sm:p-8 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_30px_60px_-25px_rgba(37,99,235,0.35)] dark:hover:shadow-[0_30px_60px_-25px_rgba(59,130,246,0.45)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] disabled:opacity-60"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] disabled:opacity-60"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] disabled:opacity-60"
                    placeholder="Project inquiry"
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    rows={6}
                    className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] disabled:opacity-60"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Status message */}
                {status.message && (
                  <div
                    className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                      status.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-300"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-[0_15px_35px_-12px_rgba(37,99,235,0.7)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send
                        size={17}
                        className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Toast keyframes */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -20px) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
    </>
  );
}