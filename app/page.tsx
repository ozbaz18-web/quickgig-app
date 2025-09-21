import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold">ברוכים הבאים ל-QuickGig</h1>
      <p className="mt-2 text-zinc-600">עבודות חד-פעמיות, מעכשיו לעכשיו.</p>

      <div className="mt-4 flex gap-3">
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-orange-500 text-white hover:bg-orange-600 shadow"
        >
          חפש עבודות
        </Link>

      <Link
          href="/jobs/new"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium border border-zinc-300 bg-white hover:bg-zinc-50"
        >
          פרסם עבודה
        </Link>
      </div>
    </>
  );
}
