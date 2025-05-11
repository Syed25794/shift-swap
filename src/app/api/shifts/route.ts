import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        user: {
          email: session.user.email!,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(shifts);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching shifts" }, { status: 500 });
  }
}
