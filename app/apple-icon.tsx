import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FF4A1C',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: '#000000',
            letterSpacing: -4,
          }}
        >
          PS
        </span>
      </div>
    ),
    { ...size },
  );
}
