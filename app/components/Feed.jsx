'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import FilterBar from './FilterBar';
import NewsCard from './NewsCard';
import { SOURCES, WORLDCUP_KEYWORDS } from '../../sources.config.js';

function normalizeText(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matchesWorldCup(item) {
  const text = normalizeText(`${item.title} ${item.excerpt}`);
  return WORLDCUP_KEYWORDS.some((kw) => text.includes(normalizeText(kw)));
}

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

const ALL_SOURCE_IDS = new Set(SOURCES.map((s) => s.id));

function SkeletonCard() {
  return (
    <div className="h-[88px] rounded-lg border border-gray-200 dark:border-gray-800 border-l-4 border-l-gray-200 dark:border-l-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse">
      <div className="flex gap-2 mb-2">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="ml-auto h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}

export default function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [readIds, setReadIds] = useState(() => new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSources, setActiveSources] = useState(() => new Set(ALL_SOURCE_IDS));
  const timerRef = useRef(null);

  // Restore read state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('el-informado-read');
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {
      // ignore
    }
  }, []);

  const fetchAll = useCallback(async (isBackground = false) => {
    if (isBackground) setRefreshing(true);

    try {
      const [feedsRes, bskyRes] = await Promise.allSettled([
        fetch('/api/feeds').then((r) => r.json()),
        fetch('/api/bluesky').then((r) => r.json()),
      ]);

      const feedItems = feedsRes.status === 'fulfilled' ? feedsRes.value.items ?? [] : [];
      const bskyItems = bskyRes.status === 'fulfilled' ? bskyRes.value.items ?? [] : [];

      // Deduplicate by URL — same story can appear in multiple RSS feeds
      const seen = new Set();
      const merged = [...feedItems, ...bskyItems]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .filter((item) => {
          const key = item.url || item.id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      setItems(merged);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError('Could not load feeds. Check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + auto-refresh
  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(() => fetchAll(true), REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchAll]);

  const handleRefresh = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => fetchAll(true), REFRESH_MS);
    fetchAll(true);
  }, [fetchAll]);

  const markAsRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem('el-informado-read', JSON.stringify([...next]));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  const toggleSource = useCallback((sourceId) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      next.has(sourceId) ? next.delete(sourceId) : next.add(sourceId);
      return next;
    });
  }, []);

  // Filtered and sorted view
  const filteredItems = items.filter((item) => {
    if (activeCategory === 'worldcup') {
      if (item.category !== 'bluesky' && !activeSources.has(item.sourceId)) return false;
      return matchesWorldCup(item);
    }
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (item.category !== 'bluesky' && !activeSources.has(item.sourceId)) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <Header
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeSources={activeSources}
          onToggleSource={toggleSource}
          totalItems={filteredItems.length}
        />

        {/* Error banner */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredItems.length === 0 && !error && (
          <div className="py-20 text-center text-gray-400 dark:text-gray-600 space-y-2">
            <p className="text-4xl">📭</p>
            <p className="text-sm">No articles to show.</p>
            <p className="text-xs">Try enabling more sources or refreshing.</p>
          </div>
        )}

        {/* Feed */}
        {!loading && filteredItems.length > 0 && (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                isRead={readIds.has(item.id)}
                onRead={markAsRead}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
