import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "MANAGER") return <p>Access Denied</p>;

  const pending = await prisma.swapRequest.findMany({
    where: { status: "PENDING" },
    include: { shift: true, user: true, volunteer: true }
  });

  return (
    <div>
      <h2>Pending Approvals</h2>
      <ul>
        {pending.map(req => (
          <li key={req.id}>{req.shift.date} - {req.shift.role} → Volunteer: {req.volunteer?.name}</li>
        ))}
      </ul>
    </div>
  );
}