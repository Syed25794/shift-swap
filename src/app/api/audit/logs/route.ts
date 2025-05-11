import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isManager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await prisma.swapRequest.findMany({
      include: {
        shift: {
          include: {
            staff: true,
          },
        },
        volunteer: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = logs.map((log) => ({
      id: log.id,
      shiftDate: log.shift.date,
      shiftTime: log.shift.time,
      shiftRole: log.shift.role,
      postedBy: log.createdBy.name,
      volunteeredBy: log.volunteer?.name || "—",
      status: log.status,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
