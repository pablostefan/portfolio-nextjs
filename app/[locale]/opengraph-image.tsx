import { ImageResponse } from 'next/og';

export const alt = 'Pablo Stefan — Software Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#030712',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 260,
            height: 260,
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            borderRadius: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 140,
              fontWeight: 700,
              color: 'white',
              letterSpacing: -4,
            }}
          >
            PS
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
