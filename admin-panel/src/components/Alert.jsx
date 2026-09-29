import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const alertConfig = {
  success: {
    icon: CheckCircle2,
    iconWrapper:
      "bg-emerald-500/10 text-emerald-600",
    title: "Success",
    accent: "bg-emerald-500",
  },

  error: {
    icon: AlertCircle,
    iconWrapper:
      "bg-red-500/10 text-red-600",
    title: "Error",
    accent: "bg-red-500",
  },

  warning: {
    icon: AlertTriangle,
    iconWrapper:
      "bg-amber-500/10 text-amber-600",
    title: "Warning",
    accent: "bg-amber-500",
  },

  info: {
    icon: Info,
    iconWrapper:
      "bg-blue-500/10 text-blue-600",
    title: "Info",
    accent: "bg-blue-500",
  },
};

export default function Alert({
  type = "info",
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  const config =
    alertConfig[type] || alertConfig.info;

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className="
        relative
        flex
        w-full
        items-center
        gap-3
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white/90
        px-4
        py-3
        shadow-[0_10px_35px_rgba(15,23,42,0.12)]
        backdrop-blur-xl
        animate-[alertSlideIn_0.3s_ease-out]
      "
    >
      {/* Left Accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${config.accent}`}
      />

      {/* Icon */}
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          ${config.iconWrapper}
        `}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900">
          {config.title}
        </p>

        <p className="mt-0.5 text-sm leading-5 text-slate-600">
          {message}
        </p>
      </div>

      {/* Close */}
      {onClose && (
        <button
          type="button"
          aria-label="Close alert"
          onClick={onClose}
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
            active:scale-90
          "
        >
          <X size={17} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}