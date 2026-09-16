import { NextResponse } from 'next/server';

// Diagnostic: confirms the stored Spotify credentials can refresh a token
// and identify the account, without ever returning the credentials or the
// token itself. Safe to hit from a browser.

export const dynamic = 'force-dynamic';

export async function GET() {
  const present = {
    SPOTIFY_CLIENT_ID: Boolean(process.env.SPOTIFY_CLIENT_ID),
    SPOTIFY_CLIENT_SECRET: Boolean(process.env.SPOTIFY_CLIENT_SECRET),
    SPOTIFY_REFRESH_TOKEN: Boolean(process.env.SPOTIFY_REFRESH_TOKEN),
    SPOTIFY_PLAYLIST_ID: Boolean(process.env.SPOTIFY_PLAYLIST_ID),
    TELEGRAM_BOT_TOKEN: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_ALLOWED_CHAT_ID: Boolean(process.env.TELEGRAM_ALLOWED_CHAT_ID),
    ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
  };

  if (!present.SPOTIFY_CLIENT_ID || !present.SPOTIFY_CLIENT_SECRET || !present.SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ ok: false, step: 'env', present });
  }

  // Shape only — never the values. Distinguishes a truncated or whitespace-
  // padded paste from a token that is simply the wrong one.
  const rt = process.env.SPOTIFY_REFRESH_TOKEN || '';
  const cs = process.env.SPOTIFY_CLIENT_SECRET || '';
  const shape = {
    refreshTokenLength: rt.length,
    refreshTokenHasWhitespace: rt !== rt.trim(),
    clientSecretLength: cs.length,
    clientSecretHasWhitespace: cs !== cs.trim(),
    clientIdLength: (process.env.SPOTIFY_CLIENT_ID || '').length,
  };

  let token;
  try {
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
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ ok: false, step: 'refresh', status: res.status, spotifyError: json.error, spotifyErrorDescription: json.error_description, present, shape });
    }
    token = json.access_token;
    shape.grantedScopes = json.scope || '(none reported)';
  } catch (err) {
    return NextResponse.json({ ok: false, step: 'refresh', message: String(err.message || err), present, shape });
  }

  try {
    const meRes = await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${token}` } });
    const me = await meRes.json();
    if (!meRes.ok) {
      return NextResponse.json({ ok: false, step: 'me', status: meRes.status, spotifyError: me.error, present });
    }
    return NextResponse.json({
      ok: true,
      account: me.display_name || me.id,
      country: me.country,
      product: me.product,
      present,
      shape,
      note: 'Credentials work. Playlist will be created on the first song if SPOTIFY_PLAYLIST_ID is not set.',
    });
  } catch (err) {
    return NextResponse.json({ ok: false, step: 'me', message: String(err.message || err), present });
  }
}
