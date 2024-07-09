import { redirect } from "next/navigation";
import { checkAdmin } from "@/server/actions/admin";

export default async function Admin() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <h1>Admin</h1>
    </div>
  );
}
