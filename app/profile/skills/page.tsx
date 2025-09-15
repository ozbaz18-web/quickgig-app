"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type SkillRow = { skill_name: string; years_experience: number; has_certificate: boolean; cert_path: string | null };

const CERT_REQUIRED = new Set(["אבטחה","מציל"]);

export default function WorkerSkillsPage() {
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, SkillRow>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUserId(user.id);

      const { data: sk } = await supabase.from("skills").select("name").order("name");
      setAllSkills((sk || []).map(s => s.name as string));

      const { data: cur } = await supabase
        .from("worker_skills")
        .select("skill_name,years_experience,has_certificate,cert_path")
        .eq("worker_id", user.id);
      const map: Record<string, SkillRow> = {};
      (cur || []).forEach(r => (map[r.skill_name] = r as any));
      setSelected(map);
    })();
  }, []);

  const selectedCount = useMemo(() => Object.keys(selected).length, [selected]);

  function toggle(name: string) {
    setSelected(prev => {
      const c = { ...prev };
      if (c[name]) delete c[name];
      else {
        if (Object.keys(c).length >= 5) { setMsg("ניתן לבחור עד 5 תחומים"); return prev; }
        c[name] = { skill_name:name, years_experience:0, has_certificate:false, cert_path:null };
      }
      return c;
    });
  }

  function setYears(name: string, v: number) {
    setSelected(p => ({ ...p, [name]: { ...p[name], years_experience: Math.max(0, v|0) } }));
  }

  async function uploadCert(name: string, file: File) {
    if (!userId) return;
    const path = `${userId}/${name}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("certs").upload(path, file, { upsert: true });
    if (error) { setMsg(error.message); return; }
    setSelected(p => ({ ...p, [name]: { ...p[name], has_certificate:true, cert_path:path } }));
  }

  async function save() {
    if (!userId) return;
    setMsg(null);
    await supabase.from("worker_skills").delete().eq("worker_id", userId);
    const rows = Object.values(selected).map(r => ({
      worker_id: userId,
      skill_name: r.skill_name,
      years_experience: r.years_experience,
      has_certificate: r.has_certificate,
      cert_path: r.cert_path
    }));
    const { error } = await supabase.from("worker_skills").insert(rows);
    setMsg(error ? error.message : "נשמר בהצלחה");
  }

  return (
    <main dir="rtl" style={{ padding:24 }}>
      <h1>התחומים שלי</h1>
      <p>בחר/י 1–5 תחומים. במקצועות “אבטחה/מציל” חובה תעודה.</p>
      {msg && <p style={{ color: msg.includes("הצלחה") ? "green" : "crimson" }}>{msg}</p>}

      <div style={{ display:"grid", gap:12, marginTop:12 }}>
        {allSkills.map(name => {
          const isSel = !!selected[name];
          return (
            <article key={name} style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="checkbox" checked={isSel} onChange={() => toggle(name)} />
                <strong>{name}</strong>
                {CERT_REQUIRED.has(name) && <span style={{ fontSize:12, color:"#b45309" }}>דורש תעודה</span>}
              </label>

              {isSel && (
                <div style={{ marginTop:8 }}>
                  <label>שנות ניסיון:
                    <input type="number" min={0}
                      value={selected[name]?.years_experience ?? 0}
                      onChange={e => setYears(name, Number(e.target.value))}
                      style={{ marginInlineStart:8, width:90 }} />
                  </label>

                  {CERT_REQUIRED.has(name) && (
                    <div style={{ marginTop:8 }}>
                      <input type="file" accept="image/*,application/pdf"
                        onChange={e => e.target.files?.[0] && uploadCert(name, e.target.files![0])} />
                      {selected[name]?.has_certificate && <div style={{ color:"green", marginTop:4 }}>תעודה הועלתה ✓</div>}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <button onClick={save} style={{ marginTop:16, padding:12, background:"black", color:"white", borderRadius:8 }}>
        שמירה
      </button>

      <p style={{ marginTop:8, color:"#666" }}>נבחרו {selectedCount} / 5 תחומים.</p>
    </main>
  );
}
