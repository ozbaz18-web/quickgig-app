"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/onboarding" },
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>התחברות</h1>
      {sent ? (
        <p>נשלח קישור למייל. בדוק/י את תיבת הדואר.</p>
      ) : (
        <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
            required
          />
          <button type="submit">שלח קישור</button>
        </form>
      )}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </main>
  );
}
