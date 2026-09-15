import { NextResponse } from 'next/server';

// Telegram webhook: receives a screenshot, asks Claude what song it is,
// searches Spotify, and adds it to a fixed playlist. Replies land back in
// the same Telegram chat, which doubles as the log — no separate database.

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID || null;

async function tg(method, body) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

function sendMessage(chatId, text) {
  return tg('sendMessage', { chat_id: chatId, text, disable_web_page_preview: false });
}

async function getFileUrl(fileId) {
  const info = await tg('getFile', { file_id: fileId });
  const filePath = info?.result?.file_path;
  if (!filePath) throw new Error('telegram getFile: no file_path');
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
}

async function identifySong(imageUrl) {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`download failed: HTTP ${imgRes.status}`);
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const base64 = buf.toString('base64');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: contentType, data: base64 } },
          {
            type: 'text',
            text: 'This is a screenshot from Instagram (a music/audio sticker on a post or reel) or from the Shazam app ' +
              '(a tagged song screen). Identify the song shown. Reply with ONLY a JSON object, nothing else: ' +
              '{"artist": string or null, "title": string or null}. Use null for both if no song name is visible anywhere in the image.',
          },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`anthropic HTTP ${res.status}`);
  const json = await res.json();
  const text = json?.content?.[0]?.text || '{}';
  const match = text.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : { artist: null, title: null };
}

async function getSpotifyUserToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`spotify token refresh HTTP ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function searchTrack(token, artist, title) {
  const q = `track:${title} artist:${artist}`;
  const res = await fetch(`https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(q)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`spotify search HTTP ${res.status}`);
  const json = await res.json();
  return json.tracks?.items?.[0] || null;
}

async function addToPlaylist(token, trackUri) {
  const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [trackUri] }),
  });
  if (!res.ok) throw new Error(`spotify add HTTP ${res.status}`);
}

async function handleSongLookup(chatId, artist, title) {
  try {
    const token = await getSpotifyUserToken();
    const track = await searchTrack(token, artist, title);
    if (!track) {
      await sendMessage(chatId, `Couldn't find "${title}" by ${artist} on Spotify. Reply with a corrected "Artist - Title" and I'll try again.`);
      return;
    }
    await addToPlaylist(token, track.uri);
    const foundArtist = track.artists.map((a) => a.name).join(', ');
    await sendMessage(chatId, `Added: ${foundArtist} — ${track.name}\n${track.external_urls.spotify}`);
  } catch (err) {
    console.error('spotify pipeline failed', err);
    await sendMessage(chatId, "Couldn't reach Spotify just now. Reply the same message again in a bit.");
  }
}

export async function POST(request) {
  let update;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });
  const chatId = message.chat?.id;
  if (!chatId) return NextResponse.json({ ok: true });

  // Bootstrap mode: no owner locked in yet. Reply with the chat id and stop —
  // never run the paid pipeline for a stranger who happened to find the bot.
  if (!ALLOWED_CHAT_ID) {
    await sendMessage(chatId, `Your chat ID is: ${chatId}\nSend this to whoever is setting up the bot, then it'll be locked to you.`);
    return NextResponse.json({ ok: true });
  }

  if (String(chatId) !== String(ALLOWED_CHAT_ID)) {
    // silently ignore anyone else
    return NextResponse.json({ ok: true });
  }

  try {
    if (message.photo && message.photo.length) {
      const largest = message.photo[message.photo.length - 1];
      const imageUrl = await getFileUrl(largest.file_id);
      const { artist, title } = await identifySong(imageUrl);
      if (!artist || !title) {
        await sendMessage(chatId, "Couldn't read a song in that screenshot. Reply with \"Artist - Title\" and I'll add it.");
        return NextResponse.json({ ok: true });
      }
      await sendMessage(chatId, `Found: ${artist} — ${title}. Searching Spotify…`);
      await handleSongLookup(chatId, artist, title);
    } else if (message.text) {
      const m = message.text.match(/^\s*(.+?)\s*[-–—]\s*(.+?)\s*$/);
      if (m) {
        await sendMessage(chatId, `Searching for ${m[1]} — ${m[2]}…`);
        await handleSongLookup(chatId, m[1], m[2]);
      } else if (!message.text.startsWith('/')) {
        await sendMessage(chatId, 'Send a screenshot, or text me "Artist - Title" directly.');
      }
    }
  } catch (err) {
    console.error('telegram handler failed', err);
    await sendMessage(chatId, "Something broke reading that one — try again in a bit.");
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, note: 'Telegram webhook is alive.' });
}
