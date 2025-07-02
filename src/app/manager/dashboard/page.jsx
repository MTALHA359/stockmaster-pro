import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "manager") {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      <p>Welcome, <strong>{session.user.email}</strong> (Role: {session.user.role})</p>
    </div>
  );
}
