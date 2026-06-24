import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { readSession } from "./session";

export async function getCurrentUser() {
  const session = await readSession();

  if (!session) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      id: session.userId,
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      emailVerifiedAt: true,
      isBlocked: true,
      blockedReason: true,
      blockedAt: true,
    },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logowanie");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== UserRole.admin) {
    redirect("/konto");
  }

  return user;
}
