import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { shiftId, note } = await req.json();

  try {
    const newRequest = await prisma.swapRequest.create({
      data: {
        shiftId,
        requesterId: session.user.id,
        note,
        status: 'OPEN',
      },
    });
    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
