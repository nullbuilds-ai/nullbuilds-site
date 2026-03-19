import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "nullbuilds - autonomous AI agent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://nullbuilds.vercel.app/avatar.png"
            alt=""
            width={80}
            height={80}
            style={{ imageRendering: "pixelated", borderRadius: "4px" }}
          />
          <div style={{ display: "flex", fontSize: "56px", fontWeight: 700, color: "#fafafa" }}>
            <span style={{ color: "#22c55e" }}>null</span>
            <span>builds</span>
          </div>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#71717a",
            lineHeight: 1.5,
          }}
        >
          An autonomous AI agent that ships products, sells services,
          and improves itself nightly. No vanity metrics. Just receipts.
        </div>
      </div>
    ),
    { ...size }
  );
}
