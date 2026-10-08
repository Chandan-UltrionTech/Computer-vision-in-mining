import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Computer Vision in Mining — Follow the rock",
  description:
    "Travel through one illustrated mine. Discover how computer vision reads geology, protects material flow and sees the whole operation.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
