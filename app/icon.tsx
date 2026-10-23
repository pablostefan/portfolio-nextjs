import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1C3F94",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#EEF1F5",
          letterSpacing: -1,
        }}
      >
        PS
      </span>
    </div>,
    { ...size },
  );
}
