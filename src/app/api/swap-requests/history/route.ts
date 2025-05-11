import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.swapRequest.findMany({
    where: {
      status: {
        in: ['APPROVED', 'REJECTED', 'CANCELLED'],
      },
    },
    include: {
      shift: true,
      requester: { select: { name: true } },
      volunteer: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(history);
}
