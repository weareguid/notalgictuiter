import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Nostalgic Tuiter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030712',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Accent line */}
        <div style={{ width: 60, height: 4, background: '#ffffff', marginBottom: 32, borderRadius: 2 }} />

        {/* Title */}
        <div style={{ fontSize: 72, fontWeight: 700, color: '#ffffff', lineHeight: 1.1, marginBottom: 20 }}>
          Nostalgic Tuiter
        </div>

        {/* Description */}
        <div style={{ fontSize: 28, color: '#9ca3af', lineHeight: 1.4 }}>
          Tu feed personal de noticias
        </div>

        {/* Sources tag */}
        <div style={{
          marginTop: 48,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          {['México', 'Internacional', 'World Cup 2026'].map((tag) => (
            <div key={tag} style={{
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: 9999,
              padding: '8px 20px',
              fontSize: 18,
              color: '#d1d5db',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ position: 'absolute', top: 80, right: 80, fontSize: 20, color: '#4b5563' }}>
          nostalgictuiter.com
        </div>
      </div>
    ),
    { ...size }
  );
}
