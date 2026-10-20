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
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "72px 80px",
          borderTop: "16px solid #0a0a0a",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#0a0a0a" }}>
          SOFTWARE · UI/UX · GRAPHIC DESIGN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Asiful Hasan Khan</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#3d3d3d" }}>
            Fullstack developer and UI/UX designer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #e3e3e3",
            paddingTop: 24,
            fontSize: 24,
            color: "#5c5c5c",
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
