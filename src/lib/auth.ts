import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase";
import { getDb } from "./db";
export async function requireAdmin() {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const admin = await getDb().adminUser.findUnique({ where: { id: user.id } });
  if (!admin) redirect("/admin/access-denied");
  return user;
}
