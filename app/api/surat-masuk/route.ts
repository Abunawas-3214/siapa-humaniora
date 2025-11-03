import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient()

export async function GET() {
	// 1. Get the current logged-in user session
  const session = await getServerSession(authOptions);

  // 2. If not logged in → reject
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Get user ID and role
  const userId = session.user.id;
  const isAdmin = session.user.isAdmin;

  // 4. Build Prisma query conditionally
  const whereCondition = isAdmin
    ? {} // Admin can see all surat masuk
    : {
        assignedUsers: {
          some: {
            userId: userId, // Only surat assigned to this user
          },
        },
      };

  // 5. Fetch surat masuk data
  const data = await prisma.suratMasuk.findMany({
    where: whereCondition,
    include: {
      assignedUsers: {
        select: {
          user: { select: { id: true, name: true } },
          emailStatus: true,
          assignedAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(data);
}