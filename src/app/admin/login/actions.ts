"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase";
import { z } from "zod";
export async function login(_previous: { error: string }, form: FormData) {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  const client = await supabaseServer();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error)
    return {
      error: "Sign-in failed. Check your credentials or try again later.",
    };
  redirect("/admin");
}
export async function logout() {
  const client = await supabaseServer();
  await client.auth.signOut();
  redirect("/admin/login");
}
