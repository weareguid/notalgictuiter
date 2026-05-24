import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { SOURCES } from '../../../sources.config.js';

// Always run dynamically — never serve a cached build-time snapshot
export const dynamic = 'force-dynamic';

const parser = new Parser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NostalgicTuiter/1.0; RSS Reader)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [['media:thumbnail', 'mediaThumbnail'], ['media:content', 'mediaContent']],
  },
});

// Strip accents so "secretaría" matches keyword "secretaria"
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matchesKeywords(item, keywords) {
  if (!keywords?.length) return true;
  const haystack = normalize(`${item.title} ${item.excerpt}`);
  return keywords.some((kw) => {
    const nkw = normalize(kw);
    // Word boundaries prevent "eleccion" matching "seleccion", "ine" matching "linea", etc.
    const escaped = nkw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(haystack);
  });
}

function cleanExcerpt(raw, max = 200) {
  if (!raw) return '';
  const text = raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}

function decodeXml(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#\d+;/g, '');
}

// Parse Google News XML sitemaps (used by sources that don't have an RSS feed)
async function fetchGoogleNewsSitemap(source) {
  try {
    const timeout = AbortSignal.timeout(12000);

    // 1. Fetch the sitemap index to get current sitemap URLs
    const indexRes = await fetch(source.url, { signal: timeout });
    const indexXml = await indexRes.text();
    const sitemapUrls = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((m) => m[1].trim())
      .filter((u) => u.includes('google-news-current'));

    if (!sitemapUrls.length) return [];

    // 2. Fetch all current sitemaps in parallel (usually 2, covering ~48h)
    const sitemaps = await Promise.all(
      sitemapUrls.map((u) =>
        fetch(u, { signal: AbortSignal.timeout(10000) }).then((r) => r.text()).catch(() => '')
      )
    );

    // 3. Parse article blocks
    const articles = [];
    for (const xml of sitemaps) {
      const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
      for (const block of blocks) {
        const loc   = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim();
        const title = block.match(/<news:title>([\s\S]*?)<\/news:title>/)?.[1]?.trim();
        const date  = block.match(/<news:publication_date>(.*?)<\/news:publication_date>/)?.[1]?.trim();
        if (!loc || !title) continue;
        articles.push({
          id: loc,
          title: decodeXml(title),
          excerpt: '',
          url: loc,
          sourceId: source.id,
          sourceName: source.name,
          category: source.category,
          domain: source.domain,
          timestamp: date || new Date().toISOString(),
        });
      }
    }

    // Deduplicate by URL, sort newest first, apply keyword filter, cap at 40
    const seen = new Set();
    return articles
      .filter((a) => { if (seen.has(a.url)) return false; seen.add(a.url); return true; })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .filter((item) => matchesKeywords(item, source.filterKeywords))
      .slice(0, 40);
  } catch (err) {
    console.warn(`[feeds] Failed to fetch sitemap "${source.name}": ${err.message}`);
    return [];
  }
}

async function fetchSource(source) {
  if (source.type === 'gnews-sitemap') return fetchGoogleNewsSitemap(source);
  try {
    const feed = await parser.parseURL(source.url);
    const mapped = feed.items.slice(0, 40).map((item) => ({
      id: item.guid || item.link || `${source.id}-${item.title}`,
      title: (item.title || 'Sin título').trim(),
      excerpt: cleanExcerpt(item.contentSnippet || item.summary || ''),
      url: item.link || '',
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      domain: source.domain,
      timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
    }));
    return mapped.filter((item) => matchesKeywords(item, source.filterKeywords));
  } catch (err) {
    console.warn(`[feeds] Failed to fetch "${source.name}": ${err.message}`);
    return [];
  }
}

export async function GET() {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));

  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return NextResponse.json(
    { items, lastUpdated: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    }
  );
}
