import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  // Anyone logged in can view open swaps
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const swaps = await prisma.swapRequest.findMany({
      where: { status: "open" },
      include: {
        shift: true,
        requester: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(swaps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch swaps" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shiftId, note } = await req.json();

  if (!shiftId) {
    return NextResponse.json({ error: "Missing shift ID" }, { status: 400 });
  }

  try {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift || shift.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't own this shift" }, { status: 403 });
    }

    const swap = await prisma.swapRequest.create({
      data: {
        shiftId,
        requesterId: session.user.id,
        note,
        status: "open",
      },
    });

    return NextResponse.json(swap, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create swap" }, { status: 500 });
  }
}
