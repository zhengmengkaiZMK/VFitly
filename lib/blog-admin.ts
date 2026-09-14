import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function getBlogAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, role: true, isActive: true, isBanned: true } });
  return user?.role === "ADMIN" && user.isActive && !user.isBanned ? user : null;
}
