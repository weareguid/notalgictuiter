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

  const token = json.refresh_token || '';
  return page(`
    <p>Connected. Save this as the <b>SPOTIFY_REFRESH_TOKEN</b> environment variable in the Vercel
    dashboard — this page does not store it anywhere.</p>
    <p>Tap the box to select all ${token.length} characters, then copy:</p>
    <input readonly value="${token}" onclick="this.select()"
      style="width:100%;padding:12px;font-family:monospace;font-size:14px;background:#222;color:#eee;border:1px solid #444;border-radius:4px">
    <p><button onclick="navigator.clipboard.writeText(document.querySelector('input').value).then(()=>{this.textContent='Copied ✓'})"
      style="padding:10px 16px;font-family:monospace;font-size:14px;background:#1DB954;color:#0B0B0B;border:none;border-radius:4px;cursor:pointer">Copy to clipboard</button></p>
    <p style="color:#888;font-size:13px">It should be ${token.length} characters long. If what you paste into Vercel is shorter, it got cut off — come back and copy again.</p>
  `);
}
