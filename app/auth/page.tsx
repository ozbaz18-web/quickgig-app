"use client";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  return (
    <main dir="rtl" className="container py-8">
      <h1 className="text-2xl font-bold mb-4">התחברות / הרשמה</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </main>
  );
}
