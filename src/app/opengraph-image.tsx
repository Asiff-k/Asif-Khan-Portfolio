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
          background: "#f7f6f2",
          color: "#121316",
          padding: "72px 80px",
          borderTop: "16px solid #121316",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#3e6b5c" }}>
          SOFTWARE · UI/UX · GRAPHIC DESIGN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Asiful Hasan Khan</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#46464b" }}>
            Software developer and UI/UX designer
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #dfe1d8",
            paddingTop: 24,
            fontSize: 24,
            color: "#5f6359",
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
