"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/jobs", label: "עבודות" },
  { href: "/my-shifts", label: "השיבוצים שלי" },
  { href: "/profile", label: "הפרופיל שלי" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-3 inset-x-0">
      <div className="max-w-screen-md mx-auto px-4">
        <div className="bg-white border rounded-2xl shadow-sm px-3 py-2 flex justify-between">
          {items.map(i => {
            const active = pathname?.startsWith(i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                className={`px-3 py-2 rounded-lg text-sm ${
                  active ? "bg-orange-50 text-orange-600" : "text-zinc-700"
                }`}
              >
                {i.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
