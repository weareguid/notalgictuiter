'use client';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mexico', label: 'México' },
  { id: 'international', label: 'Internacional' },
  { id: 'worldcup', label: 'World Cup 2026' },
];

export default function FilterBar({ activeCategory, onCategoryChange, totalItems }) {
  return (
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
  );
}
