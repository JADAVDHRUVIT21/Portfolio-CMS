import { useRef, useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import avatarUrl from "../assets/avatar.png";

export default function Hero() {
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  /* Subtle mouse-follow parallax on the avatar */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let raf = null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      target.x = (px - 0.5) * 2;
      target.y = (py - 0.5) * 2;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      setTilt({ x: current.x, y: current.y });
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Parallax transform for the avatar image */
  const avatarStyle = {
    transform: `translate3d(${tilt.x * -18}px, ${tilt.y * -18}px, 0) scale(1.05)`,
    transition: "transform 150ms ease-out",
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="
        relative flex min-h-screen items-center overflow-hidden
        px-6 pb-20 pt-28 sm:px-8
        bg-white text-slate-900
        dark:bg-slate-950 dark:text-white
        transition-colors duration-300
      "
    >
      {/* ============================================
          MOBILE — big visible avatar background
      ============================================ */}
      <div aria-hidden="true" className="absolute inset-0 lg:hidden">
        {/* Avatar image — strong opacity, positioned so the king is centered */}
        <img
          src={avatarUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: 0.95 }}
          draggable={false}
        />

        {/* Overlay — dark tint at top for text, light at bottom to reveal avatar */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/60 to-white/5 dark:from-slate-950/95 dark:via-slate-950/60 dark:to-slate-950/5" />

        {/* Extra side vignette so text remains crisp on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-transparent dark:from-slate-950/70" />
      </div>

      {/* ============================================
          DESKTOP — avatar on right 55%
      ============================================ */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden">
          <img
            src={avatarUrl}
            alt=""
            aria-hidden="true"
            style={avatarStyle}
            className="h-full w-full object-cover object-top"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-slate-950 dark:via-slate-950/50 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-slate-950/70" />
        </div>
      </div>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl dark:bg-blue-600/25" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />
      </div>

      {/* ============================================
          CONTENT
      ============================================ */}
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
              Welcome to my portfolio
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Building modern
              <span className="block text-blue-600 dark:text-blue-400">
                digital experiences.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              I build responsive web applications and scalable backend systems
              with modern technologies, clean architecture, and user-focused
              interfaces.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#projects"
                className="
                  inline-flex items-center justify-center gap-2 rounded-xl
                  bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white
                  transition hover:bg-blue-500
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                View My Work
                <ArrowDown size={18} />
              </a>

              <a
                href="#contact"
                className="
                  inline-flex items-center justify-center rounded-xl
                  border px-6 py-3.5 text-sm font-semibold
                  border-slate-300 text-slate-900 hover:bg-slate-100
                  dark:border-slate-700 dark:text-white dark:hover:bg-white/10
                  transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                Contact Me
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com/JADAVDHRUVIT21"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="
                  group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium
                  border-slate-300 text-slate-700
                  dark:border-slate-700 dark:text-slate-300
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  hover:-translate-y-0.5
                  hover:border-slate-400 hover:text-slate-900
                  hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.35)]
                  dark:hover:border-slate-500 dark:hover:text-white
                  dark:hover:shadow-[0_10px_30px_-10px_rgba(148,163,184,0.45)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-r from-slate-900/5 via-slate-900/10 to-slate-900/5
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                    dark:from-white/5 dark:via-white/10 dark:to-white/5
                  "
                />
                <span className="relative z-10">GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/jadavdhruvit/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="
                  group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium
                  border-slate-300 text-slate-700
                  dark:border-slate-700 dark:text-slate-300
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  hover:-translate-y-0.5
                  hover:border-blue-400 hover:text-blue-600
                  hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.55)]
                  dark:hover:border-blue-500 dark:hover:text-blue-400
                  dark:hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.55)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-r from-blue-500/10 via-blue-500/20 to-blue-500/10
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />
                <span className="relative z-10">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}