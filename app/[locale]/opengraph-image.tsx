import { ImageResponse } from 'next/og';

export const alt = 'Pablo Stefan - Software Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function OgImage() {
  const skills = ['Flutter', 'Dart', 'Design Systems', 'Mobile Architecture', 'TypeScript'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: '#030712',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient blob top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)',
          }}
        />
        {/* Gradient blob bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, zIndex: 1 }}>
          {/* Greeting */}
          <span style={{ fontSize: 22, color: '#94A3B8', letterSpacing: 2 }}>
            pablostefan.com.br
          </span>

          {/* Name */}
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #F9FAFB, #A78BFA)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
            }}
          >
            Pablo Stefan
          </span>

          {/* Role */}
          <span
            style={{
              fontSize: 32,
              fontWeight: 500,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Software Architect · Flutter · XP Inc.
          </span>

          {/* Skills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: 16,
                  color: '#94A3B8',
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
