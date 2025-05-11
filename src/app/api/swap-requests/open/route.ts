import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const openRequests = await prisma.swapRequest.findMany({
    where: {
      status: 'OPEN',
      requesterId: { not: session.user.id },
    },
    include: {
      shift: true,
      requester: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json(openRequests);
}
