import "../styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Lifeform",
  description: "A reflective loop between human input and synthetic curiosity.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-background to-secondary text-foreground">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
