'use client';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mexico', label: 'México' },
  { id: 'international', label: 'Internacional' },
];

export default function FilterBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            activeCategory === cat.id
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800',
          ].join(' ')}
        >
          {cat.label}
        </button>
      ))}

    </div>
  );
}
