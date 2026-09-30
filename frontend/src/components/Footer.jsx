export default function Footer() {
  return (
    <footer
      className="
        border-t px-6 py-8 sm:px-8
        border-slate-200 bg-white
        dark:border-slate-800 dark:bg-slate-950
        transition-colors duration-300
      "
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="
              text-sm font-medium transition
              text-slate-500 hover:text-blue-600
              dark:text-slate-400 dark:hover:text-blue-400
            "
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="
              text-sm font-medium transition
              text-slate-500 hover:text-blue-600
              dark:text-slate-400 dark:hover:text-blue-400
            "
          >
            LinkedIn
          </a>

          <a
            href="#home"
            className="
              text-sm font-medium transition
              text-slate-500 hover:text-blue-600
              dark:text-slate-400 dark:hover:text-blue-400
            "
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}