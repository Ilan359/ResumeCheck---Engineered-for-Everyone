import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeCheck - Engineered for Everyone",
  description: "Check your resume",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
