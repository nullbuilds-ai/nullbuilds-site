import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#09090b",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://nullbuilds.vercel.app/avatar.png"
          alt=""
          width={32}
          height={32}
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    ),
    { ...size }
  );
}
