"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DebugPage() {
  const [envOk, setEnvOk] = useState("בודק ENV...");
  const [dbOk, setDbOk] = useState("בודק DB...");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setEnvOk("❌ ENV לא נטענו (.env.local + אתחול שרת)"); return;
    }
    setEnvOk("✅ ENV OK");
    (async () => {
      const { error } = await supabase.from("skills").select("name").limit(1);
      setDbOk(error ? "❌ DB ERROR: " + error.message : "✅ DB OK");
    })();
  }, []);

  return <main dir="rtl" style={{padding:24}}><p>{envOk}</p><p>{dbOk}</p></main>;
}
