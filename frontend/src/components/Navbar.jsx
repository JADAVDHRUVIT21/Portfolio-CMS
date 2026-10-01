import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ introDone = true }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Read saved theme immediately when the component is created.
  // This prevents the page from starting in dark mode on every refresh.
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pillReady, setPillReady] = useState(false);

  const navRef = useRef(null);
  const navItemsRef = useRef(null);
  const pillRef = useRef(null);
  const itemRefs = useRef([]);

  /* ---------------------------------------------
     Apply saved theme
  --------------------------------------------- */
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  /* ---------------------------------------------
     Entrance — waits for intro (preloader) to finish
  --------------------------------------------- */
  useEffect(() => {
    if (!introDone) return;

    const t = setTimeout(() => setMounted(true), 150);

    return () => clearTimeout(t);
  }, [introDone]);

  /* ---------------------------------------------
     Scroll state
  --------------------------------------------- */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ---------------------------------------------
     PILL POSITIONING
  --------------------------------------------- */
  const movePill = useCallback((index) => {
    const el = itemRefs.current[index];
    const pill = pillRef.current;

    if (!el || !pill) return;

    const left = el.offsetLeft;
    const width = el.offsetWidth;

    pill.style.transform = `translateX(${left}px)`;
    pill.style.width = `${width}px`;
    pill.style.opacity = "1";
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const settle = () => {
      const idx =
        hoveredIndex !== null ? hoveredIndex : activeIndex;

      movePill(idx);
      setPillReady(true);
    };

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(settle);

      return () => cancelAnimationFrame(raf2);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(settle);
    }

    const t = setTimeout(settle, 300);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t);
    };
  }, [
    mounted,
    movePill,
    hoveredIndex,
    activeIndex,
  ]);

  useEffect(() => {
    if (!pillReady) return;

    const idx =
      hoveredIndex !== null ? hoveredIndex : activeIndex;

    movePill(idx);
  }, [
    hoveredIndex,
    activeIndex,
    movePill,
    pillReady,
  ]);

  useEffect(() => {
    if (!pillReady) return;

    const handle = () => {
      const idx =
        hoveredIndex !== null ? hoveredIndex : activeIndex;

      movePill(idx);
    };

    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
    };
  }, [
    hoveredIndex,
    activeIndex,
    movePill,
    pillReady,
  ]);

  /* ---------------------------------------------
     Scroll-spy
  --------------------------------------------- */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sections.length) return;

    let raf = null;

    const updateActive = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      // Bottom-of-page override
      if (scrollY + viewportH >= docH - 4) {
        setActiveIndex(sections.length - 1);
        return;
      }

      const refLine = viewportH * 0.4;

      let bestIdx = 0;
      let bestDistance = Infinity;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= refLine) {
          const distance = Math.abs(rect.top - refLine);

          if (distance < bestDistance) {
            bestDistance = distance;
            bestIdx = i;
          }
        }
      });

      if (bestDistance === Infinity) {
        bestIdx = 0;
      }

      setActiveIndex(bestIdx);
    };

    const onScroll = () => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        updateActive();
        raf = null;
      });
    };

    // Honour URL hash on mount
    const syncFromHash = () => {
      const hash = window.location.hash;

      if (!hash) return false;

      const idx = navItems.findIndex(
        (item) => item.href === hash
      );

      if (idx === -1) return false;

      setActiveIndex(idx);

      const el = document.querySelector(hash);

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({
            behavior: "auto",
            block: "start",
          });

          updateActive();
        }, 0);
      }

      return true;
    };

    const hadHash = syncFromHash();

    if (!hadHash) {
      updateActive();
    } else {
      setTimeout(updateActive, 100);
    }

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  const handleNavClick = (index) => {
    setActiveIndex(index);
    setMenuOpen(false);
  };

  /* ---------------------------------------------
     Entrance animation
  --------------------------------------------- */
  const entranceStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted
      ? "translateY(0) scale(1)"
      : "translateY(-25px) scale(0.95)",
    transition:
      "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const isDark = theme === "dark";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6"
        style={{
          paddingTop: scrolled ? "14px" : "28px",
          transition:
            "padding-top 0.4s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
        }}
      >
        <nav
          ref={navRef}
          style={{
            ...entranceStyle,
            pointerEvents: "auto",
          }}
          className={[
            "relative flex items-center justify-between",
            "w-full max-w-[880px]",
            "rounded-full",
            "px-2.5 sm:px-3",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isDark
              ? "bg-slate-900/80 border border-white/10"
              : "bg-white/85 border border-slate-200/80",
            "backdrop-blur-2xl",
            scrolled
              ? "h-[58px] shadow-[0_18px_45px_-10px_rgba(0,0,0,0.45)]"
              : "h-[64px] shadow-[0_15px_40px_-8px_rgba(0,0,0,0.28)]",
          ].join(" ")}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={() => handleNavClick(0)}
            className="group flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(59,130,246,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_8px_22px_rgba(59,130,246,0.65)]">
              P
            </span>

            <span
              className={[
                "text-[15px] font-semibold tracking-tight",
                isDark
                  ? "text-white"
                  : "text-slate-900",
              ].join(" ")}
            >
              Portfolio
            </span>
          </a>

          {/* Desktop nav links */}
          <div
            ref={navItemsRef}
            className="relative hidden items-center lg:flex"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span
              ref={pillRef}
              aria-hidden="true"
              className={[
                "pointer-events-none absolute left-0 top-1/2 -z-0",
                "h-[38px] -translate-y-1/2 rounded-full",
                "will-change-transform",
                isDark
                  ? "bg-white/10"
                  : "bg-slate-900/10",
              ].join(" ")}
              style={{
                opacity: 0,
                transition:
                  "transform 320ms cubic-bezier(0.22,1,0.36,1), width 320ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease, background-color 250ms ease",
                boxShadow: isDark
                  ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                  : "inset 0 0 0 1px rgba(15,23,42,0.06)",
              }}
            />

            {navItems.map((item, i) => {
              const isActive = activeIndex === i;
              const isHovered = hoveredIndex === i;
              const highlight = isActive || isHovered;

              return (
                <a
                  key={item.href}
                  ref={(el) =>
                    (itemRefs.current[i] = el)
                  }
                  href={item.href}
                  onMouseEnter={() =>
                    setHoveredIndex(i)
                  }
                  onClick={() => handleNavClick(i)}
                  className={[
                    "relative z-10 whitespace-nowrap rounded-full",
                    "px-3.5 py-2 text-[13.5px] font-medium",
                    "focus-visible:outline-none focus-visible:ring-2",
                    isDark
                      ? "focus-visible:ring-blue-400/60"
                      : "focus-visible:ring-blue-500/40",
                    highlight
                      ? isDark
                        ? "text-white"
                        : "text-slate-900"
                      : isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-500 hover:text-slate-900",
                  ].join(" ")}
                  style={{
                    transition:
                      "color 200ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1)",
                    transformOrigin:
                      "center center",
                    transform: isHovered
                      ? "scale(1.05)"
                      : "scale(1)",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Theme button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className={[
                "relative grid h-9 w-9 place-items-center rounded-full",
                "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-0.5 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-blue-400/60"
                  : "text-slate-600 hover:bg-slate-900/8 hover:text-slate-900 focus-visible:ring-blue-500/40",
              ].join(" ")}
            >
              <span
                className="grid place-items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: isDark
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
                }}
              >
                {isDark ? (
                  <Moon size={17} />
                ) : (
                  <Sun size={17} />
                )}
              </span>
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={menuOpen}
              className={[
                "grid h-9 w-9 place-items-center rounded-full lg:hidden",
                "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-0.5 hover:scale-105",
                "focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "text-slate-300 hover:bg-white/10 hover:text-white focus-visible:ring-blue-400/60"
                  : "text-slate-600 hover:bg-slate-900/8 hover:text-slate-900 focus-visible:ring-blue-500/40",
              ].join(" ")}
            >
              <span
                className="grid place-items-center transition-transform duration-300"
                style={{
                  transform: menuOpen
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                }}
              >
                {menuOpen ? (
                  <X size={19} />
                ) : (
                  <Menu size={19} />
                )}
              </span>
            </button>
          </div>

          {/* Mobile dropdown */}
          <div
            className={[
              "absolute left-0 right-0 top-[calc(100%+10px)] lg:hidden",
              "overflow-hidden rounded-3xl",
              "transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isDark
                ? "bg-slate-900/95 border border-white/10"
                : "bg-white/95 border border-slate-200/80",
              "backdrop-blur-2xl",
              menuOpen
                ? "max-h-[520px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-3 pointer-events-none",
            ].join(" ")}
            style={{
              boxShadow: menuOpen
                ? isDark
                  ? "0 25px 60px -12px rgba(0,0,0,0.55)"
                  : "0 25px 60px -12px rgba(15,23,42,0.18)"
                : "none",
            }}
          >
            <div className="flex flex-col gap-1 p-3">
              {navItems.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    handleNavClick(i)
                  }
                  className={[
                    "rounded-2xl px-4 py-3 text-sm font-medium",
                    "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-y-0.5 hover:scale-[1.02]",
                    activeIndex === i
                      ? isDark
                        ? "bg-white/10 text-white"
                        : "bg-slate-900/8 text-slate-900"
                      : isDark
                      ? "text-slate-300 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
                  ].join(" ")}
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen
                      ? "translateY(0)"
                      : "translateY(-8px)",
                    transition: `opacity 400ms cubic-bezier(0.22,1,0.36,1) ${
                      menuOpen
                        ? 120 + i * 40
                        : 0
                    }ms, transform 400ms cubic-bezier(0.22,1,0.36,1) ${
                      menuOpen
                        ? 120 + i * 40
                        : 0
                    }ms, background-color 250ms ease, color 250ms ease`,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}