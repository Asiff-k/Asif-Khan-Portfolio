import { ImageResponse } from "next/og";

export const alt = "Asiful Hasan Khan, software developer and UI/UX designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f5f5f5",
          padding: "72px 80px",
          borderTop: "16px solid #f5f5f5",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#ffffff" }}>
          SOFTWARE · UI/UX · GRAPHIC DESIGN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Asiful Hasan Khan</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#c4c4c4" }}>
            Software developer and UI/UX designer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #262626",
            paddingTop: 24,
            fontSize: 24,
            color: "#a3a3a3",
          }}
        >
          <span>Sylhet, Bangladesh</span>
          <span>Portfolio</span>
        </div>
      </div>
    ),
    size,
  );
}
