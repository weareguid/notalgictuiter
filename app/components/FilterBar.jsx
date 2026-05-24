'use client';

import { SOURCES, BLUESKY_HANDLES } from '../../sources.config.js';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mexico', label: 'México' },
  { id: 'international', label: 'Internacional' },
  { id: 'worldcup', label: 'World Cup 2026' },
  ...(BLUESKY_HANDLES.length > 0 ? [{ id: 'bluesky', label: 'Bluesky' }] : []),
];

const CHIP_ON = {
  mexico: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50',
  international: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
  bluesky: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50',
};

const CHIP_ON_WORLDCUP = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50';

const CHIP_OFF = 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800/60 dark:text-gray-600 dark:border-gray-700/50';

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  activeSources,
  onToggleSource,
  totalItems,
}) {
  const visibleSources = (activeCategory === 'all' || activeCategory === 'worldcup')
    ? SOURCES
    : SOURCES.filter((s) => s.category === activeCategory);

  function selectAll() {
    SOURCES.forEach((s) => {
      if (!activeSources.has(s.id)) onToggleSource(s.id);
    });
  }

  function selectNone() {
    SOURCES.forEach((s) => {
      if (activeSources.has(s.id)) onToggleSource(s.id);
    });
  }

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={[
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              activeCategory === cat.id
                ? cat.id === 'worldcup'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white'
                  : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800',
            ].join(' ')}
          >
            {cat.label}
          </button>
        ))}

        <span className="ml-auto text-xs text-gray-400 dark:text-gray-600 tabular-nums">
          {totalItems} items
        </span>
      </div>

      {/* Source chips */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {visibleSources.map((source) => {
          const on = activeSources.has(source.id);
          return (
            <button
              key={source.id}
              onClick={() => onToggleSource(source.id)}
              className={[
                'px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all',
                on
                  ? (activeCategory === 'worldcup' ? CHIP_ON_WORLDCUP : CHIP_ON[source.category])
                  : CHIP_OFF,
              ].join(' ')}
            >
              {source.name}
            </button>
          );
        })}

        {/* All / None shortcuts */}
        <div className="ml-auto flex gap-1 shrink-0">
          <button
            onClick={selectAll}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-1"
          >
            All
          </button>
          <span className="text-gray-300 dark:text-gray-700 text-xs self-center">/</span>
          <button
            onClick={selectNone}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-1"
          >
            None
          </button>
        </div>
      </div>
    </div>
  );
}
