import { NextResponse } from 'next/server';

// One-time setup: visit this URL in a browser, log into Spotify, approve
// playlist access. The callback shows a refresh token to save as an env
// var — nothing is stored by this route itself.

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const redirectUri = `${new URL(request.url).origin}/api/spotify-callback`;
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'playlist-modify-private playlist-modify-public',
  });
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
