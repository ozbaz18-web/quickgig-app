// app/jobs/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Job = {
  id: string; title: string; address: string | null;
  starts_at: string | null; hourly_rate_ils: number | null;
  category_id: number | null;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jobs")
        .select("id,title,address,starts_at,hourly_rate_ils,category_id")
        .eq("status","open")
        .order("created_at",{ ascending:false });
      setJobs((data as Job[]) || []);
    })();
  }, []);

  return (
    <main dir="rtl" className="container py-8">
      <h1 className="text-2xl font-bold">עבודות זמינות</h1>
      <ul className="mt-4 space-y-3">
        {jobs.map(j => (
          <li key={j.id} className="border rounded-2xl p-4">
            <div className="font-medium">{j.title}</div>
            <div className="text-sm text-gray-600">{j.address || "מיקום לא צוין"}</div>
            <div className="text-sm mt-1">
              {j.starts_at ? new Date(j.starts_at).toLocaleString("he-IL") : "זמן לא צוין"} · {j.hourly_rate_ils ?? "-"} ₪/שעה
            </div>
            <form className="mt-3" onSubmit={async (e) => {
              e.preventDefault();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) { alert("צריך להתחבר"); return; }
              await supabase.from("job_interest").insert({ job_id: j.id, worker_id: user.id });
              alert("הפרטים נשלחו למעסיק!");
            }}>
              <button className="bg-brand text-white rounded-xl px-4 py-2">אני מעוניין</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
