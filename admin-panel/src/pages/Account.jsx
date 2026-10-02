import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Lock,
  Save,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

/* =========================================================
   CONFIRMATION MODAL
========================================================= */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  confirmColor = "blue",
  onCancel,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  const colorMap = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      accent: "from-blue-500 via-cyan-500 to-blue-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      button: "bg-violet-600 hover:bg-violet-700",
      accent: "from-violet-500 via-purple-500 to-violet-500",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      accent: "from-red-500 via-orange-500 to-red-500",
    },
  };

  const colors = colorMap[confirmColor] || colorMap.blue;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        onClick={loading ? undefined : onCancel}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        style={{ animation: "backdropFade 0.25s ease-out forwards" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        style={{
          animation: "modalPop 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      >
        <div className={`h-1 w-full bg-gradient-to-r ${colors.accent}`} />

        <div className="p-6 sm:p-7">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.icon}`}>
            <AlertTriangle size={26} strokeWidth={2.2} />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {message}
          </p>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                ios-button inline-flex min-h-11 items-center justify-center
                rounded-xl border border-slate-200 bg-white px-5 py-3
                text-sm font-semibold text-slate-700 transition
                hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`
                ios-button inline-flex min-h-11 items-center justify-center gap-2
                rounded-xl px-5 py-3 text-sm font-semibold text-white
                shadow-sm transition
                disabled:cursor-not-allowed disabled:opacity-50
                ${colors.button}
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IOS-STYLE SUCCESS TOAST
========================================================= */
function SuccessToast({ open, title, message }) {
  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[250] flex justify-center px-4 sm:top-6">
      <div
        className="
          pointer-events-auto flex w-full max-w-sm items-center gap-3
          overflow-hidden rounded-2xl border border-emerald-100
          bg-white/95 px-4 py-3.5 shadow-2xl shadow-emerald-500/10
          backdrop-blur-xl
        "
        style={{ animation: "toastSlideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      >
        {/* Animated checkmark circle */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={22} className="text-emerald-600" strokeWidth={2.5} />
          <span
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            style={{ animation: "successPulse 1.2s ease-out forwards" }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            {title}
          </p>
          {message && (
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ACCOUNT PAGE
========================================================= */
export default function Account() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();

  // ==================== NAME FORM ====================
  const [nameForm, setNameForm] = useState({
    full_name: "",
    email: "",
  });
  const [savingName, setSavingName] = useState(false);
  const [showNameConfirm, setShowNameConfirm] = useState(false);

  // ==================== PASSWORD FORM ====================
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==================== TOAST STATE ====================
  const [toast, setToast] = useState(null);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setNameForm({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ==================== HANDLE NAME CHANGE ====================
  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setNameForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();

    if (!nameForm.full_name.trim()) {
      showNotification("warning", "Full name is required.");
      return;
    }

    if (!nameForm.email.trim()) {
      showNotification("warning", "Email is required.");
      return;
    }

    // Open confirmation modal instead of submitting right away
    setShowNameConfirm(true);
  };

  const confirmNameUpdate = async () => {
    try {
      setSavingName(true);

      const response = await api.put("/auth/me", {
        full_name: nameForm.full_name.trim(),
        email: nameForm.email.trim(),
      });

      if (updateUser) {
        updateUser(response.data);
      }

      setShowNameConfirm(false);

      // iOS-style success toast
      setToast({
        title: "Profile Updated",
        message: "Your changes have been saved.",
      });
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        error.response?.data?.detail || "Failed to update profile."
      );
      setShowNameConfirm(false);
    } finally {
      setSavingName(false);
    }
  };

  // ==================== HANDLE PASSWORD CHANGE ====================
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwordForm.current_password) {
      showNotification("warning", "Please enter your current password.");
      return;
    }

    if (!passwordForm.new_password) {
      showNotification("warning", "Please enter a new password.");
      return;
    }

    if (passwordForm.new_password.length < 6) {
      showNotification(
        "warning",
        "New password must be at least 6 characters."
      );
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showNotification("warning", "Passwords do not match.");
      return;
    }

    // Open confirmation modal
    setShowPasswordConfirm(true);
  };

  const confirmPasswordUpdate = async () => {
    try {
      setSavingPassword(true);

      await api.put("/auth/me/password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      setShowPasswordConfirm(false);

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      // iOS-style success toast
      setToast({
        title: "Password Updated",
        message: "Your password has been changed successfully.",
      });
    } catch (error) {
      console.error(error);
      showNotification(
        "error",
        error.response?.data?.detail || "Failed to update password."
      );
      setShowPasswordConfirm(false);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================== KEYFRAMES ==================== */}
      <style>{`
        @keyframes backdropFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes toastSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPulse {
          from { transform: scale(1); opacity: 1; }
          to   { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* ==================== SUCCESS TOAST ==================== */}
      <SuccessToast
        open={!!toast}
        title={toast?.title}
        message={toast?.message}
      />

      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="ios-button flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your profile information and password.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== USER CARD ==================== */}
      <div className="ios-card overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />
          </div>

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold text-white shadow-2xl shadow-blue-500/40">
                {(user?.full_name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-[3px] border-slate-950" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-white">
                {user?.full_name || "Administrator"}
              </h2>
              <p className="mt-0.5 truncate text-sm text-slate-400">
                {user?.email || ""}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                <ShieldCheck size={12} />
                Administrator Account
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== TWO COLUMN LAYOUT ==================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ==================== PROFILE FORM ==================== */}
        <div className="ios-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Profile Information
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update your name and email address.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserRound size={18} />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={nameForm.full_name}
                  onChange={handleNameChange}
                  placeholder="Enter your full name"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    pl-10 pr-4 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={nameForm.email}
                  onChange={handleNameChange}
                  placeholder="Enter your email"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    pl-10 pr-4 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                  "
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingName}
                className="
                  ios-button inline-flex items-center justify-center gap-2
                  rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white
                  shadow-sm transition hover:bg-blue-700
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <Save size={16} />
                {savingName ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* ==================== PASSWORD FORM ==================== */}
        <div className="ios-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Change Password
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5 p-6">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    pl-10 pr-12 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  placeholder="At least 6 characters"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    pl-10 pr-12 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    pl-10 pr-12 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password match indicator */}
              {passwordForm.confirm_password && (
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  {passwordForm.new_password === passwordForm.confirm_password ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span className="text-emerald-600 font-medium">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} className="text-red-600" />
                      <span className="text-red-600 font-medium">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="
                  ios-button inline-flex items-center justify-center gap-2
                  rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white
                  shadow-sm transition hover:bg-violet-700
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <Lock size={16} />
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ==================== CONFIRMATION MODALS ==================== */}
      <ConfirmModal
        open={showNameConfirm}
        title="Save profile changes?"
        message="Are you sure you want to update your profile information? Your name and email will be changed."
        confirmLabel="Yes, Save Changes"
        confirmColor="blue"
        onCancel={() => setShowNameConfirm(false)}
        onConfirm={confirmNameUpdate}
        loading={savingName}
      />

      <ConfirmModal
        open={showPasswordConfirm}
        title="Update your password?"
        message="You'll need to use the new password next time you log in. Make sure you've saved it somewhere safe."
        confirmLabel="Yes, Update Password"
        confirmColor="violet"
        onCancel={() => setShowPasswordConfirm(false)}
        onConfirm={confirmPasswordUpdate}
        loading={savingPassword}
      />
    </div>
  );
}