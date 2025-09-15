"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function BottomNav() {
  const [role, setRole] = useState<"Worker"|"Employer"|null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("role,is_admin").eq("id", user.id).maybeSingle();
      if (data) { setRole(data.role as any); setIsAdmin(!!data.is_admin); }
    })();
  }, []);

  return (
    <nav dir="rtl" style={{
      position:"fixed", bottom:0, left:0, right:0,
      borderTop:"1px solid #e5e5e5", background:"rgba(255,255,255,0.95)",
      backdropFilter:"blur(6px)", zIndex:50
    }}>
      <ul style={{
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)",
        textAlign:"center", margin:0, padding:"8px 0", listStyle:"none", fontSize:14
      }}>
        <li><Link href="/my-shifts">עבודות שקבעתי</Link></li>
        <li><Link href="/jobs">עבודות זמינות</Link></li>
        <li><Link href="/profile">הפרופיל שלי</Link></li>
        <li>
          {role === "Employer" ? <Link href="/employer/claims">פניות עובדים</Link>
           : isAdmin ? <Link href="/admin/employers">אדמין</Link>
           : <span>—</span>}
        </li>
      </ul>
    </nav>
  );
}
