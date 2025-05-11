import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pending = await prisma.swapRequest.findMany({
    where: { status: 'PENDING_APPROVAL' },
    include: {
      shift: true,
      requester: { select: { name: true } },
      volunteer: { select: { name: true } },
    },
  });

  return NextResponse.json(pending);
}
