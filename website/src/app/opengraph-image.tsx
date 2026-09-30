import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Default social preview image (LinkedIn, WhatsApp, iMessage, X...) for every page.
export const alt = "Scikit: websites, software & cloud for Australian businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Inter Tight Bold (OFL licence), bundled so the image builds without a network request.
  const font = await readFile(join(process.cwd(), "src/assets/InterTight-Bold.ttf")).catch(() => null);
  const logoSvg = await readFile(join(process.cwd(), "public/logos/scikit-wordmark-white.svg"));
  const logo = `data:image/svg+xml;base64,${logoSvg.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#F8F7F4",
          padding: "72px 80px",
          fontFamily: font ? "Inter Tight" : "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            bottom: -220,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(255,106,46,0.45), rgba(255,106,46,0) 70%)",
          }}
        />
        {/* The real wordmark (dotless ı with the orange dot), 362×150 viewBox. */}
        <img src={logo} alt="" width={174} height={72} />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.98, letterSpacing: "-0.045em" }}>
          <span>Get Found.</span>
          <span>Work Smarter.</span>
          <span style={{ display: "flex" }}>
            Stay Secure<span style={{ color: "#FF6A2E" }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#C9C7C2", letterSpacing: "-0.01em" }}>
          Websites, software &amp; cloud · Melbourne &amp; Australia-wide
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Inter Tight", data: font, weight: 700, style: "normal" }] : [] }
  );
}
