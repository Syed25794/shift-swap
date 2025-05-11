import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { swapRequestId } = await req.json();

  if (!swapRequestId) {
    return NextResponse.json({ error: "Missing swapRequestId" }, { status: 400 });
  }

  try {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId },
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap request not found" }, { status: 404 });
    }

    if (swap.requesterId === session.user.id) {
      return NextResponse.json({ error: "You can't volunteer for your own request" }, { status: 403 });
    }

    if (swap.volunteerId) {
      return NextResponse.json({ error: "This swap already has a volunteer" }, { status: 409 });
    }

    const updated = await prisma.swapRequest.update({
      where: { id: swapRequestId },
      data: {
        volunteerId: session.user.id,
        status: "matched",
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to volunteer" }, { status: 500 });
  }
}
