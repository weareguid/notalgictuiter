'use client';

const BORDER_COLORS = {
  mexico: 'border-l-red-500',
  international: 'border-l-blue-600',
  worldcup: 'border-l-emerald-500',
};

function formatTime(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NewsCard({ item, isRead, onRead }) {
  const borderColor = isRead
    ? 'border-l-gray-300 dark:border-l-gray-700'
    : BORDER_COLORS[item.category] || 'border-l-gray-400';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onRead(item.id)}
      className={[
        'group flex flex-col gap-1 p-4 rounded-lg',
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800 border-l-4',
        borderColor,
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700',
        'transition-all duration-150 cursor-pointer',
      ].join(' ')}
    >
      {/* Source row */}
      <div className="flex items-center gap-1.5">
        <img
          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`}
          alt=""
          width={14}
          height={14}
          className="rounded-sm shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {item.sourceName}
        </span>
        <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-600 tabular-nums shrink-0">
          {formatTime(item.timestamp)}
        </span>
      </div>

      {/* Headline */}
      <h2
        className={[
          'text-sm font-semibold leading-snug line-clamp-2',
          'text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400',
        ].join(' ')}
      >
        {item.title}
      </h2>

      {/* Excerpt */}
      {item.excerpt && (
        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 leading-relaxed">
          {item.excerpt}
        </p>
      )}
    </a>
  );
}
