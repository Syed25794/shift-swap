import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const shifts = await prisma.shift.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(shifts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shifts" },
      { status: 500 }
    );
  }
}
