'use client';

import { useState, useEffect } from 'react';

function timeSince(date) {
  if (!date) return null;
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return 'Updated just now';
  if (mins === 1) return 'Updated 1 min ago';
  return `Updated ${mins} min ago`;
}

export default function Header({ lastUpdated, refreshing, onRefresh }) {
  const [isDark, setIsDark] = useState(false);
  const [timeStr, setTimeStr] = useState(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Tick the "updated X ago" label every 30s
  useEffect(() => {
    const tick = () => setTimeStr(lastUpdated ? timeSince(lastUpdated) : null);
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  function toggleTheme() {
    const html = document.documentElement;
    const next = !html.classList.contains('dark');
    html.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  }

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Brand */}
        <div className="flex-1 min-w-0">
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Nostalgic Tuiter
          </span>
          {timeStr && (
            <span className="ml-3 text-xs text-gray-400 dark:text-gray-600">
              {timeStr}
            </span>
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh now"
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle dark mode"
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
