import "./globals.css";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

export const metadata = {
  title: "QuickGig",
  description: "ג׳וב בקליק.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <Header />

        {/* התוכן של כל הדפים */}
        <main className="max-w-screen-md mx-auto px-4 pt-4 pb-24">
          {children}
        </main>

        {/* ניווט תחתון פעם אחת בלבד */}
        <BottomNav />
      </body>
    </html>
  );
}
