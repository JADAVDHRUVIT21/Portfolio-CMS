import { useEffect, useState } from "react";

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState("rings"); // rings -> text -> exit
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Slower, more cinematic timing
    const t1 = setTimeout(() => setPhase("text"), 1400);
    const t2 = setTimeout(() => setPhase("exit"), 3400);
    const t3 = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center
        bg-white
        dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        transition-opacity duration-700 ease-out
        ${phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* Radial rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="
              absolute rounded-full
              border border-blue-500/50
              dark:border-blue-400/60
            "
            style={{
              width: `${140 + i * 100}px`,
              height: `${140 + i * 100}px`,
              animation: `preloaderRing 2.6s cubic-bezier(0.22,1,0.36,1) ${
                i * 0.18
              }s both`,
              boxShadow:
                "0 0 24px -6px rgba(59,130,246,0.35), inset 0 0 24px -6px rgba(59,130,246,0.25)",
            }}
          />
        ))}
      </div>

      {/* Name reveal */}
      <div className="relative z-10 text-center px-6">
        <h1
          className={`
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            font-bold tracking-[0.2em]
            text-slate-900 dark:text-white
            transition-all duration-900 ease-out
            ${
              phase === "rings"
                ? "opacity-0 translate-y-4 blur-md"
                : "opacity-100 translate-y-0 blur-0"
            }
          `}
        >
          DHRUVIT JADAV
        </h1>

        <div
          className={`
            mt-4 h-[2px] mx-auto
            bg-gradient-to-r from-transparent via-blue-500 to-transparent
            transition-all duration-900 ease-out delay-300
            ${phase === "rings" ? "w-0 opacity-0" : "w-48 opacity-100"}
          `}
        />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes preloaderRing {
          0%   { transform: scale(0.15); opacity: 0; }
          35%  { opacity: 1; }
          100% { transform: scale(1); opacity: 0.12; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="preloaderRing"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}