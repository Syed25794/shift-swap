import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div>
      <header style={{ padding: '10px', background: '#f4f4f4', marginBottom: '20px' }}>
        <h2>ShiftSwap Dashboard</h2>
        <nav style={{ marginTop: '10px' }}>
          <Link href="/dashboard/shifts">My Shifts</Link> |{" "}
          <Link href="/dashboard/swap-requests">Open Swaps</Link> |{" "}
          {user?.role === "MANAGER" && <Link href="/dashboard/approvals">Approvals</Link>} |{" "}
          <Link href="/dashboard/history">History</Link> |{" "}
          <SignOutButton />
        </nav>
      </header>
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  );
}
