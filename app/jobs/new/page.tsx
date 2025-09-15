// app/jobs/new/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NewJobPage() {
  const [title,setTitle] = useState("");
  const [address,setAddress] = useState("");
  const [startsAt,setStartsAt] = useState("");
  const [rate,setRate] = useState<number | "">("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (!profile || profile.role !== "Employer") alert("עמוד זה מיועד למעסיקים בלבד");
    })();
  }, []);

  return (
    <main dir="rtl" className="container py-8">
      <h1 className="text-2xl font-bold mb-4">פרסום עבודה</h1>
      <form className="space-y-4 max-w-md" onSubmit={async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { alert("צריך להתחבר"); return; }
        const { error } = await supabase.from("jobs").insert({
          title, address, starts_at: startsAt || null, hourly_rate_ils: rate === "" ? null : Number(rate), created_by: user.id
        });
        if (error) alert(error.message); else { alert("התפרסם!"); location.href="/jobs"; }
      }}>
        <input className="w-full rounded-xl border p-3" placeholder="כותרת" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="w-full rounded-xl border p-3" placeholder="כתובת / מיקום" value={address} onChange={e=>setAddress(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="datetime-local" value={startsAt} onChange={e=>setStartsAt(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="number" placeholder="שכר לשעה (₪)" value={rate} onChange={e=>setRate(e.target.value===""? "" : Number(e.target.value))} />
        <button className="bg-brand text-white rounded-xl px-4 py-2">פרסם</button>
      </form>
    </main>
  );
}
