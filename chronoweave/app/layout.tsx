import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronoweave | Temporal Accord Loom",
  description:
    "Chronoweave helps you broker treaties with your future self by weaving ephemeral intentions into living rituals.",
  openGraph: {
    title: "Chronoweave",
    description:
      "An experiential studio for weaving future-facing micro-rituals and balancing temporal energy.",
    url: "https://chronoweave.vercel.app",
    siteName: "Chronoweave",
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
