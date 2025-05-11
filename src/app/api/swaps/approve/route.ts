import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.isManager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { swapRequestId, action } = await req.json();

  if (!swapRequestId || !["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapRequestId },
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap request not found" }, { status: 404 });
    }

    if (!swap.volunteerId) {
      return NextResponse.json({ error: "No volunteer yet" }, { status: 409 });
    }

    const updated = await prisma.swapRequest.update({
      where: { id: swapRequestId },
      data: {
        status: action,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update approval status" }, { status: 500 });
  }
}
