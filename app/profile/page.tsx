"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient"; // אם אתה בתוך app/(tabs)/profile -> שנה ל "../../../lib/supabaseClient"

type Role = "Worker" | "Employer";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<Role>("Worker");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, city, role")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setCity(data.city ?? "");
        setRole((data.role as Role) ?? "Worker");
      }

      setLoading(false);
    })();
  }, []);

  async function save() {
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg("נא להתחבר"); return; }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email,
      full_name: fullName,
      phone,
      city,
      role
    });

    setMsg(error ? error.message : "נשמר ✓");
  }

  if (loading) return <main dir="rtl" style={{ padding: 24 }}>טוען…</main>;

  return (
    <main dir="rtl" style={{ padding: 24, maxWidth: 520 }}>
      <h1>הפרופיל שלי</h1>
      {msg && <p style={{ color: msg.includes("✓") ? "green" : "crimson" }}>{msg}</p>}

      <label style={row}>
        אימייל
        <input value={email} disabled style={input} />
      </label>

      <label style={row}>
        שם מלא
        <input value={fullName} onChange={e => setFullName(e.target.value)} style={input} />
      </label>

      <label style={row}>
        טלפון
        <input value={phone} onChange={e => setPhone(e.target.value)} style={input} />
      </label>

      <label style={row}>
        עיר
        <input value={city} onChange={e => setCity(e.target.value)} style={input} />
      </label>

      <fieldset style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
        <legend>תפקיד</legend>
        <label style={{ marginInlineEnd: 12 }}>
          <input type="radio" checked={role === "Worker"} onChange={() => setRole("Worker")} /> עובד/ת
        </label>
        <label>
          <input type="radio" checked={role === "Employer"} onChange={() => setRole("Employer")} /> מעסיק/ה
        </label>
      </fieldset>

      <button onClick={save} style={{ marginTop: 16, padding: 12, background: "black", color: "white", borderRadius: 8 }}>
        שמירה
      </button>

      <p style={{ marginTop: 12 }}>
        <a href="/profile/skills">עריכת תחומים ותעודות</a>
      </p>
    </main>
  );
}

const row: React.CSSProperties = { display: "grid", gap: 6, margin: "10px 0" };
const input: React.CSSProperties = { padding: 10, border: "1px solid #ccc", borderRadius: 8 };
