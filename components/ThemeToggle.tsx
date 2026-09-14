"use client";

import { Moon, Sun } from "lucide-react";

function setDarkMode(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export function ThemeToggle() {
  function toggleTheme() {
    setDarkMode(!document.documentElement.classList.contains("dark"));
  }

  return (
    <button
      aria-label="Toggle color theme"
      className="fixed top-4 right-4 z-50 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-stone-50/90 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-950/90 dark:hover:border-blue-400 dark:hover:text-blue-300"
      onClick={toggleTheme}
      type="button"
    >
      <Moon aria-hidden="true" className="size-4 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
    </button>
  );
}
