// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [name,setName] = useState(""); const [phone,setPhone] = useState(""); const [role,setRole] = useState<"Worker"|"Employer">("Worker");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) { setName(data.full_name || ""); setPhone(data.phone || ""); setRole(data.role || "Worker"); }
    })();
  }, []);

  return (
    <main dir="rtl" className="container py-8">
      <h1 className="text-2xl font-bold mb-4">הפרופיל שלי</h1>
      <form className="space-y-4 max-w-md" onSubmit={async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
        await supabase.from("profiles").upsert({ id:user.id, full_name:name, phone, role });
        alert("נשמר");
      }}>
        <input className="w-full rounded-xl border p-3" placeholder="שם מלא" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="טלפון" value={phone} onChange={e=>setPhone(e.target.value)} />
        <select className="w-full rounded-xl border p-3" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="Worker">אני עובד</option>
          <option value="Employer">אני מעסיק</option>
        </select>
        <button className="bg-brand text-white rounded-xl px-4 py-2">שמור</button>
      </form>
    </main>
  );
}


