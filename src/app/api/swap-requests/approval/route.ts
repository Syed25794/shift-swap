import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, action } = await req.json();

  const request = await prisma.swapRequest.findUnique({ where: { id } });
  if (!request || request.status !== 'PENDING_APPROVAL' || !request.volunteerId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (action === 'approve') {
    await prisma.$transaction([
      prisma.swapRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      }),
      prisma.shift.update({
        where: { id: request.shiftId },
        data: { userId: request.volunteerId },
      }),
    ]);
  } else if (action === 'reject') {
    await prisma.swapRequest.update({
      where: { id },
      data: { status: 'OPEN', volunteerId: null },
    });
  }

  return NextResponse.json({ success: true });
}
