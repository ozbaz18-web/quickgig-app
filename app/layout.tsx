// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import BottomNav from "./components/BottomNav";

export const metadata: Metadata = {
  title: "QuickGig",
  description: "ג'וב בקליק.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-white text-zinc-900">
        {/* רווח בתחתית כדי שהניווט לא יכסה את התוכן */}
        <div style={{ paddingBottom: 80 }}>{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}


import "./globals.css";
