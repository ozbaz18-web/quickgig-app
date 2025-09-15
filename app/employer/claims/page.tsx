"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Row = {
  id: string;
  status: string | null;
  created_at: string;
  worker: { id: string; full_name: string | null; phone: string | null; email: string | null } | null;
  gig: { id: string; title: string | null; hourly_rate_ils: number | null; spots: number | null } | null;
};

export default function EmployerClaimsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      const { data: emp } = await supabase.from("employers").select("status").eq("user_id", user.id).maybeSingle();
      setAllowed(!!emp && emp.status === "Approved");

      if (emp?.status === "Approved") {
        const { data, error } = await supabase
          .from("claims")
          .select("id,status,created_at, worker:worker_id(id,profiles(full_name,phone,email)), gig:gig_id(id,title,hourly_rate_ils,spots), gigs!inner(employer_id)")
          .eq("gigs.employer_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) {
          setRows((data || []).map((r: any) => ({
            id: r.id,
            status: r.status,
            created_at: r.created_at,
            worker: r.worker ? { id: r.worker.id, full_name: r.worker.profiles?.full_name, phone: r.worker.profiles?.phone, email: r.worker.profiles?.email } : null,
            gig: r.gig,
          })));
        }
      }
    })();
  }, []);

  async function approve(row: Row) {
    setMsg(null);
    if (!row.gig || !row.worker) return;

    // 1) עדכן CLAIM ל-Approved
    const { error: cErr } = await supabase.from("claims").update({ status: "Approved" }).eq("id", row.id);
    if (cErr) { setMsg(cErr.message); return; }

    // 2) צור Assignment
    const { error: aErr } = await supabase.from("assignments").insert({
      gig_id: row.gig.id,
      worker_id: row.worker.id,
      status: "Assigned"
    });
    if (aErr) { setMsg(aErr.message); return; }

    setRows(cur => cur.map(x => x.id === row.id ? { ...x, status: "Approved" } : x));
    setMsg("העובד שובץ בהצלחה.");
  }

  async function reject(id: string) {
    setMsg(null);
    const { error } = await supabase.from("claims").update({ status: "Rejected" }).eq("id", id);
    if (!error) setRows(cur => cur.map(x => x.id === id ? { ...x, status: "Rejected" } : x));
  }

  if (allowed === null) return <main dir="rtl" style={{padding:24}}>טוען…</main>;
  if (allowed === false) return <main dir="rtl" style={{padding:24}}><h1>פניות עובדים</h1><p>החשבון כמעסיק טרם אושר.</p></main>;

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>פניות עובדים</h1>
      {msg && <p>{msg}</p>}
      <div style={{ display:"grid", gap:12 }}>
        {rows.map(r => (
          <article key={r.id} style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div><strong>{r.gig?.title}</strong> — ₪{r.gig?.hourly_rate_ils}/שעה</div>
                <div>מועמד: {r.worker?.full_name || "—"} · {r.worker?.phone || ""} · {r.worker?.email || ""}</div>
                <div>סטטוס: {r.status || "Pending"}</div>
              </div>
              <div>
                <button onClick={()=>approve(r)} disabled={r.status==="Approved"} style={{ marginInlineEnd:8 }}>אישור</button>
                <button onClick={()=>reject(r.id)} disabled={r.status==="Rejected"}>דחייה</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

