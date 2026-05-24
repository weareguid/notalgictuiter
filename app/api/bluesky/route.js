import { NextResponse } from 'next/server';
import { BskyAgent } from '@atproto/api';
import { BLUESKY_HANDLES } from '../../../sources.config.js';

// Always run dynamically — never serve a cached build-time snapshot
export const dynamic = 'force-dynamic';

async function fetchHandle(handle) {
  try {
    const agent = new BskyAgent({ service: 'https://public.api.bsky.app' });

    // Authenticate if credentials provided (enables access to logged-in feeds)
    if (process.env.BLUESKY_HANDLE && process.env.BLUESKY_APP_PASSWORD) {
      await agent.login({
        identifier: process.env.BLUESKY_HANDLE,
        password: process.env.BLUESKY_APP_PASSWORD,
      });
    }

    const res = await agent.getAuthorFeed({ actor: handle, limit: 25 });

    return res.data.feed
      .filter((item) => !item.reason) // skip reposts
      .map((item) => {
        const post = item.post;
        const rkey = post.uri.split('/').pop();
        const text = post.record?.text || '';

        return {
          id: post.uri,
          title: post.author.displayName || `@${post.author.handle}`,
          excerpt: text.length > 200 ? text.slice(0, 200).replace(/\s+\S*$/, '') + '…' : text,
          url: `https://bsky.app/profile/${post.author.handle}/post/${rkey}`,
          sourceId: `bsky-${handle.replace(/[^a-z0-9]/gi, '-')}`,
          sourceName: `@${post.author.handle}`,
          category: 'bluesky',
          domain: 'bsky.app',
          timestamp: post.indexedAt,
        };
      });
  } catch (err) {
    console.warn(`[bluesky] Failed to fetch "${handle}": ${err.message}`);
    return [];
  }
}

export async function GET() {
  if (BLUESKY_HANDLES.length === 0) {
    return NextResponse.json({ items: [] });
  }

  const results = await Promise.allSettled(BLUESKY_HANDLES.map(fetchHandle));

  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return NextResponse.json(
    { items },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
