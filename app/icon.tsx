import { ImageResponse } from 'next/og';

export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
          <path
            d="M 10 35 V 13 H 16 C 22 13 22 23 16 23 H 10"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 36 16 C 36 13 28 13 28 18 C 28 23 36 25 36 30 C 36 35 28 35 28 32"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
