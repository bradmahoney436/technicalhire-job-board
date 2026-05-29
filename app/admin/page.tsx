import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const isAuthed = session?.value === "authenticated" && !!process.env.ADMIN_PASSWORD;

  return isAuthed ? <AdminDashboard /> : <LoginForm />;
}
