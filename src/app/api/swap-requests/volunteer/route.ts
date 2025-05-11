import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { requestId } = await req.json();

  try {
    const existing = await prisma.swapRequest.findUnique({ where: { id: requestId } });
    if (!existing || existing.volunteerId) {
      return NextResponse.json({ error: 'Already has a volunteer' }, { status: 400 });
    }

    const updated = await prisma.swapRequest.update({
      where: { id: requestId },
      data: {
        volunteerId: session.user.id,
        status: 'PENDING_APPROVAL',
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to volunteer' }, { status: 500 });
  }
}
