"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const SKILLS = ["אבטחה", "מציל", "מלצרות", "ניקיון"] as const;
type SkillName = typeof SKILLS[number];

export default function NewJobPage() {
  // הרשאות מעסיק
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // שדות הטופס
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [starts, setStarts] = useState("");
  const [ends, setEnds] = useState("");
  const [rate, setRate] = useState<number>(45);
  const [spots, setSpots] = useState<number>(1);

  // תחום ותעודה
  const [requiredSkill, setRequiredSkill] = useState<SkillName | "">("");
  const [requiresCert, setRequiresCert] = useState(false);

  // הודעות
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      const { data: emp } = await supabase
        .from("employers")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      setAllowed(!!emp && emp.status === "Approved");
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("לא מחובר"); return; }

    if (!title || !address || !starts || !ends) {
      setErr("נא למלא כותרת, כתובת, התחלה וסיום");
      return;
    }

    const payload = {
      employer_id: user.id,
      title,
      description: null as string | null,
      address,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      starts_at: new Date(starts).toISOString(),
      ends_at: new Date(ends).toISOString(),
      hourly_rate_ils: Number(rate),
      spots: Number(spots),
      status: "Open" as const,
      assign_mode: "approve" as const,
      required_skill: requiredSkill || null,
      requires_cert: requiresCert,
    };

    const { error } = await supabase.from("gigs").insert(payload);
    if (error) setErr(error.message);
    else {
      setMsg("העבודה פורסמה!");
      // איפוס בסיסי
      setTitle(""); setAddress(""); setLat(""); setLng(""); setStarts(""); setEnds("");
      setRate(45); setSpots(1); setRequiredSkill(""); setRequiresCert(false);
    }
  }

  if (allowed === null) {
    return <main dir="rtl" style={{ padding: 24 }}>בודק הרשאות…</main>;
  }
  if (!allowed) {
    return (
      <main dir="rtl" style={{ padding: 24 }}>
        <h1>פרסום עבודה</h1>
        <p>החשבון שלך כמעסיק עדיין לא אושר על־ידי אדמין.</p>
      </main>
    );
  }

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>פרסום עבודה</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <input
          placeholder="כותרת"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <input
          placeholder="כתובת"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
          <input
            placeholder="lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </div>

        <label>התחלה
          <input
            type="datetime-local"
            value={starts}
            onChange={(e) => setStarts(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>סיום
          <input
            type="datetime-local"
            value={ends}
            onChange={(e) => setEnds(e.target.value)}
            style={{ display: "block", width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>שכר לשעה (₪)
          <input
            type="number"
            min={35}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label>מספר תקנים
          <input
            type="number"
            min={1}
            value={spots}
            onChange={(e) => setSpots(Number(e.target.value))}
            style={{ display: "block", width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <select
          value={requiredSkill}
          onChange={(e) => setRequiredSkill(e.target.value as SkillName | "")}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        >
          <option value="">בחר תחום דרוש</option>
          {SKILLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={requiresCert}
            onChange={(e) => setRequiresCert(e.target.checked)}
          />
          נדרשת תעודה
        </label>

        <button type="submit" style={{ padding: 12, background: "black", color: "white", borderRadius: 8 }}>
          פרסום
        </button>
      </form>
    </main>
  );
}
