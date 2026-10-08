"use client";
import dynamic from "next/dynamic";

// The journey is a scroll-driven, browser-only experience (ScrollTrigger,
// Lenis, matchMedia, ResizeObserver, getBoundingClientRect). Prerendering it
// bakes thousands of SVG attributes into server HTML, so any edit — or any
// browser-only state — hydrates against stale markup and React reports
// "server rendered HTML didn't match the client". Render it on the client
// only; page metadata (title/description) still comes from layout.tsx.
const MiningJourney = dynamic(
  () => import("@/experience/MiningJourney").then((m) => m.MiningJourney),
  { ssr: false },
);
export default function Page() {
  return <MiningJourney />;
}
