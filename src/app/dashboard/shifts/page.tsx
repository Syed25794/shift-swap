import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/app/lib/prisma";

export default async function ShiftsPage() {
  const session = await getServerSession(authOptions);
  const shifts = await prisma.shift.findMany({
    where: { userId: session?.user.id },
    orderBy: { date: "asc" }
  });

  return (
    <div>
      <h2>My Shifts</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift.id}>{shift.date} - {shift.timeSlot} - {shift.role}</li>
        ))}
      </ul>
    </div>
  );
}