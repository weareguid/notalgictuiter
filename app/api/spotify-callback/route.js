import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function page(body) {
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><body style="font-family:monospace;background:#111;color:#eee;padding:32px;max-width:640px;margin:0 auto">${body}</body>`,
    { headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (error) return page(`<p>Spotify said no: ${error}</p>`);
  if (!code) return page('<p>No code in the URL — something went wrong before this step.</p>');

  const redirectUri = `${url.origin}/api/spotify-callback`;
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
  });
  const json = await res.json();
  if (!res.ok) return page(`<p>Token exchange failed:</p><pre>${JSON.stringify(json, null, 2)}</pre>`);

  return page(`
    <p>Connected. Copy this value and save it yourself as the <b>SPOTIFY_REFRESH_TOKEN</b> environment variable
    in the Vercel dashboard — this page does not store it anywhere.</p>
    <p style="background:#222;padding:12px;border-radius:4px;word-break:break-all">${json.refresh_token}</p>
    <p>Once saved, you can close this tab.</p>
  `);
}
