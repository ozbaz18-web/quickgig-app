"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type GigLite = {
  title: string;
  starts_at: string;
  ends_at: string;
  hourly_rate_ils: number;
};

type Row = {
  id: string;
  status: string | null;
  gig: GigLite | null;
};

function toRow(d: any): Row {
  return {
    id: String(d.id),
    status: d.status ?? null,
    gig: d.gig
      ? {
          title: String(d.gig.title ?? ""),
          starts_at: String(d.gig.starts_at ?? ""),
          ends_at: String(d.gig.ends_at ?? ""),
          hourly_rate_ils: Number(d.gig.hourly_rate_ils ?? 0),
        }
      : null,
  };
}

function hoursDiff(s: string, e: string) {
  if (!s || !e) return 0;
  const ms = new Date(e).getTime() - new Date(s).getTime();
  return Math.max(0, ms / 36e5);
}

export default function MyShiftsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const { data, error } = await supabase
        .from("assignments")
        .select("id,status, gig:gig_id(title,starts_at,ends_at,hourly_rate_ils)")
        .eq("worker_id", user.id)
        .order("created_at", { ascending: false });

      if (error) setMsg(error.message);
      else setRows((data ?? []).map(toRow));
    })();
  }, []);

  const monthIncome = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return rows.reduce((sum, r) => {
      if (!r.gig) return sum;
      const yms = r.gig.starts_at?.slice(0, 7);
      if (yms !== ym) return sum;
      const hrs = hoursDiff(r.gig.starts_at, r.gig.ends_at);
      return sum + hrs * (r.gig.hourly_rate_ils ?? 0);
    }, 0);
  }, [rows]);

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>עבודות שקבעתי</h1>
      {msg && <p style={{ color: "crimson" }}>{msg}</p>}
      <p style={{ marginTop: 8 }}>
        <strong>השכר החודשי שלי (דמו): ₪{monthIncome.toFixed(0)}</strong>
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {rows.map((r) => (
          <article key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div><strong>{r.gig?.title || "ללא כותרת"}</strong></div>
            <div style={{ color: "#666" }}>
              {r.gig?.starts_at
                ? new Date(r.gig.starts_at).toLocaleString("he-IL")
                : "—"}
              {" – "}
              {r.gig?.ends_at
                ? new Date(r.gig.ends_at).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
                : "—"}
            </div>
            <div>₪{r.gig?.hourly_rate_ils ?? 0}/שעה · סטטוס: {r.status ?? "—"}</div>
          </article>
        ))}

        {rows.length === 0 && <p>עוד אין עבודות משובצות.</p>}
      </div>
    </main>
  );
}
