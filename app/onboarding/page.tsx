"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OnboardingPage() {
  const [msg, setMsg] = useState("בודק…");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMsg("לא מחובר. חזור/י ל־/auth"); return; }

      // יוצר/מעדכן פרופיל בסיסי
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
      }, { onConflict: "id" });

      setMsg("מחובר ✓ — אפשר להמשיך לעבודה");
    })();
  }, []);

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>Onboarding</h1>
      <p>{msg}</p>
      <p><a href="/jobs">לעבודות זמינות</a> · <a href="/profile">הפרופיל שלי</a></p>
    </main>
  );
}
