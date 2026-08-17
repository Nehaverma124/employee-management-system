// Applies and persists light/dark theme across both pages.
(function () {
  const STORAGE_KEY = "el_theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Apply immediately (before paint) to avoid a flash of the wrong theme.
  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
})();
