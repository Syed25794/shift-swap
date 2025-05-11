import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SwapRequestsPage() {
  const session = await getServerSession(authOptions);
  const swaps = await prisma.swapRequest.findMany({
    where: {\      status: "OPEN",
      userId: { not: session?.user.id }
    },
    include: { shift: true, user: true }
  });

  return (
    <div>
      <h2>Open Swap Requests</h2>
      <ul>
        {swaps.map(swap => (
          <li key={swap.id}>{swap.shift.date} - {swap.shift.role} by {swap.user.name}</li>
        ))}
      </ul>
    </div>
  );
}