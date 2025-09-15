"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Emp = { user_id: string; company_name: string | null; business_category: string | null; status: string | null };

export default function AdminEmployersPage() {
  const [items, setItems] = useState<Emp[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
      setIsAdmin(!!prof?.is_admin);

      if (prof?.is_admin) {
        const { data } = await supabase.from("employers")
          .select("user_id, company_name, business_category, status")
          .order("company_name", { ascending: true });
        setItems(data || []);
      }
    })();
  }, []);

  async function setStatus(user_id: string, status: "Approved" | "Rejected") {
    setMsg(null);
    const { error } = await supabase.from("employers").update({ status }).eq("user_id", user_id);
    if (error) setMsg(error.message);
    else {
      setItems((cur) => cur.map(x => x.user_id === user_id ? { ...x, status } : x));
      setMsg("עודכן.");
    }
  }

  if (isAdmin === null) return <main dir="rtl" style={{padding:24}}>טוען…</main>;
  if (!isAdmin) return <main dir="rtl" style={{padding:24}}><h1>אדמין</h1><p>אין לך הרשאות.</p></main>;

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>אדמין – אישור מעסיקים</h1>
      {msg && <p>{msg}</p>}
      <div style={{ display:"grid", gap:12 }}>
        {items.map(e => (
          <article key={e.user_id} style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
              <div>
                <strong>{e.company_name || "ללא שם"}</strong>
                <div style={{ color:"#666" }}>{e.business_category || "—"}</div>
              </div>
              <div>
                <span style={{ marginInlineEnd: 8 }}>סטטוס: {e.status || "Pending"}</span>
                <button onClick={()=>setStatus(e.user_id,"Approved")} style={{ marginInlineEnd:8 }}>אישור</button>
                <button onClick={()=>setStatus(e.user_id,"Rejected")}>דחייה</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
